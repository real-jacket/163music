{
    let view = {
        el:'#app',
        init(){
            this.$el = $(this.el)
        },
        template:`
            <audio src={{url}}></audio>
            <div>
                <button class = 'play'>播放</button>
                <button class = 'pause'>暂停</button>
            </div>
        `,
        render(song){
            this.$el.html(this.template
                .replace('{{url}}',song.url))
        },
        play(button){
            let audio = this.$el.find('audio')[0];
            audio.play()
        },
        pause(button){
            let audio = this.$el.find('audio')[0];
            audio.pause()
        }
    }
    let model = {
        data:{
            id:'',
            name:'',
            singer: '',
            url: ''
        },
        getSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data, {id,...song.attributes})
                return song;
            })
        }
    }
    let controller = {
        init(view,model){
            this.view  = view;
            this.model = model;
            this.view.init();
            let id = this.getSongId();
            this.model.getSong(id).then(()=>{
                this.view.render(this.model.data)
            });
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.play',(e)=>{
                this.view.play()
            })
            this.view.$el.on('click','.pause',()=>{
                this.view.pause()
            })
        },
        getSongId(){
            let search = window.location.search;
            if(search.indexOf('?') === 0){
                search = search.substring(1)
            }

            let array = search.split('&').filter((v=>v))
            let id = '';
            for(let i = 0;i < array.length;i++){
                let kv = array[i].split('=');
                key = kv[0];
                value = kv[1];
                if(key === 'id'){
                    id = value;
                    break
                }
            }

            return id;
        }
    }

    controller.init(view,model);
}