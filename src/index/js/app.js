{
    let view = {
        el:'#app',
        init(){
            this.$el = $(this.el)
        },
        render(song){
            this.$el.find('audio').attr('src',song.url)
            this.$el.find('.disc-container').addClass('playing')
            this.$el.css('background-image',`url(${song.cover})`)
            this.$el.find('.disc>.cover').attr('src',song.cover)
        },
        play(){
            this.$el.find('audio')[0].play()
            this.$el.find('.disc-container').addClass('playing')
        },
        pause(){
            this.$el.find('audio')[0].pause()
            this.$el.find('.disc-container').removeClass('playing')
        }
    }
    let model = {
        data:{
            song:{
                id:'',
                name:'',
                singer: '',
                url: '',
                cover:''
            },
            status:'play'  
        },
        getSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, {id,...song.attributes})
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
                this.view.render(this.model.data.song)
            });
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.icon-wrapper',()=>{
                let status = this.model.data.status
                if(status === 'pause'){
                    this.view.play();
                    this.model.data.status = 'play'
                }else{
                    this.view.pause()
                    this.model.data.status = 'pause'
                }
            });
            this.view.$el.find('audio').on('ended',()=>{
                this.view.pause();
                this.model.data.status = 'pause'
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