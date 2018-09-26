{
    let view = {
        el:'.page > main .playlist-form',
        init(){
            this.$el = $(this.el);
        },
        template: `
        <form class="form">
            <div class="row">
                <label>歌单</label>
                <input type="text" name="title" value = "__title__"> 
            </div>
            <div class="row">
                <label>封面</label>
                <input type="text" name="cover" value = "__cover__"> 
            </div>
            <div class="row">
                <label>描述</label>
                <textarea name="description" cols=25 rows=4>__description__</textarea>
            </div>
            <div class="row action">
                <input type="submit" value="保存"><input type="button" value="添加">
            </div>
        </form>
        `,
        render(data){
            let placeholders = ['title','cover','description']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            this.$el.html(html);
            if(data.id){
                $(this.el).prepend('<h1>编辑歌单</h1>')
            }else {
                $(this.el).prepend('<h1>新建歌单</h1>')
            }
        },
        reset(){
            this.render({
                title: '',id: '',cover:'',description:''
            })
        }
    };

    let model = {
        data: {
            title: '',id: '',cover:'',description:''
        },
        creat(data){
         // 声明类型
         var SongList = AV.Object.extend('SongList');
         // 新建对象
         var songlist = new SongList();
         // 设置名称
         songlist.set('title',data.title);
         songlist.set('cover',data.cover);
         songlist.set('description',data.description);

         return songlist.save().then((newSong)=> {
            let { id, attributes } = newSong;
            this.data = {id,...attributes}
         }, (error) => {
             console.error(error);
         });
        },
        update(data){
            // 第一个参数是 className，第二个参数是 objectId
            var songlist = AV.Object.createWithoutData('SongList', this.data.id);
            // 修改属性
            songlist.set('title',data.title);
            songlist.set('cover',data.cover);
            songlist.set('description',data.description);
            // 保存到云端
            return songlist.save().then((reseponse)=>{
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
                console.log('click传来的数据')
                console.log(data)
                this.model.data = data;
                this.view.render(this.model.data);
            }),
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data = {
                        title: '',id: '',cover:'',description:''
                    };
                }else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data);
            })
        },
        create(){
            let needs = 'title cover description'.split(' ');
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
            let needs = 'title cover description'.split(' ');
            console.log('needs')
            console.log(needs)
            let data = {};
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            console.log('data')
            console.log(data)
            this.model.update(data).then(()=>{
                console.log('this.model.data')
                console.log(this.model.data)
                window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault();
                let title = this.view.$el.find('input[name=title]')[0].value
                if(this.model.data.id){
                    this.update()
                }else{
                    if(title === ''){
                        alert('请输入歌单信息')
                    }else{
                        this.create()
                    }
                }
            })
            this.view.$el.on('click','form input[type=button]',(e)=>{
                console.log(e.currentTarget)
                console.log(this.model.data)
                window.eventHub.emit('addClick',JSON.parse(JSON.stringify(this.model.data)))
            })
        }
    };

    controller.init(view,model);
}