{
    let view = {
        el:'.page > main',
        init(){
            this.$el = $(this.el);
        },
        template: `
        <form class="form">
            <div class="row">
                <label>歌名</label>
                <input type="text" name="name" value = "__name__"> 
            </div>
            <div class="row">
                <label>歌手</label>
                <input type="text" name="singer" value = "__singer__"> 
            </div>
            <div class="row">
                <label>URL</label>
                <input type="text" name="url" value = "__url__"> 
            </div>
            <div class="row">
                <label>封面</label>
                <input type="text" name="cover" value = "__cover__"> 
            </div>
            <div class="row">
                <label>歌词</label>
                <textarea name="lyrics" cols=50 rows=10>__lyrics__</textarea>
            </div>
            <div class="row action">
                <input type="submit" value="保存">
            </div>
        </form>
        `,
        render(data = {}){
            let placeholders = ['name','singer','url','id','cover','lyrics']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html);
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else {
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render({
                name: '',singer: '',url: '',id: '',cover:'',lyrics:''
            })
        }
    };

    let model = {
        data: {
            name: '',singer: '',url: '',id: '',cover:'',lyrics:''
        },
        creat(data){
         // 声明类型
         var Song = AV.Object.extend('Song');
         // 新建对象
         var song = new Song();
         // 设置名称
         song.set('name',data.name);
         song.set('singer',data.singer);
         song.set('url',data.url);
         song.set('cover',data.cover);
         song.set('lyrics',data.lyrics);

         return song.save().then((newSong)=> {
            let { id, attributes } = newSong;
            this.data = {id,...attributes}
         }, (error) => {
             console.error(error);
         });
        },
        update(data){
            // 第一个参数是 className，第二个参数是 objectId
            var song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name);
            song.set('singer',data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics',data.lyrics);
            // 保存到云端
            return song.save().then((reseponse)=>{
                Object.assign(this.data,data)
                return data
            })
        }
    };

    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('click',(data)=>{
                this.model.data = data;
                this.view.render(this.model.data);
            }),
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data = {
                        name: '',singer: '',url: '',id: '',cover:'',lyrics:''
                    };
                }else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data);
            })
        },
        create(){
            let needs = 'name singer url cover lyrics'.split(' ');
            let data = {};
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.creat(data)
                .then(()=>{
                    this.view.reset()
                    window.eventHub.emit('create',JSON.parse(JSON.stringify(this.model.data)));
                })
        },
        update(){
            let needs = 'name singer url cover lyrics'.split(' ');
            let data = {};
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data).then(()=>{
                window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault();
                if(this.model.data.id){
                    this.update()
                }else{
                    this.create()
                }
            })
        }
    };

    controller.init(view,model);
}