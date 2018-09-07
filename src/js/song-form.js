{
    let view = {
        el:'.page > main',
        init(){
            this.$el = $(this.el);
        },
        template: `
        <h1>新建歌曲</h1>
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
            <div class="row action">
                <input type="submit" value="保存">
            </div>
        </form>
        `,
        render(data = {}){
            let placeholders = ['name','singer','url','id']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html);
        },
        reset(){
            this.render({})
        }
    };

    let model = {
        data: {
            name: '',singer: '',url: '',id: ''
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

         return song.save().then((newSong)=> {
            let { id, attributes } = newSong;
            this.data = {id,...attributes}
         }, (error) => {
             console.error(error);
         });
        }
    };

    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.view.render(this.model.data);
            this.bindEvents();
            window.eventHub.on('upload',(data)=>{
                this.view.render(data)
            })
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault();
                let needs = 'name singer url'.split(' ');
                let data = {};
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.creat(data)
                    .then(()=>{
                        this.view.reset()
                        window.eventHub.emit('create',this.model.data)
                    })
            })
        }
    };

    controller.init(view,model);
}