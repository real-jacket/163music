{
    let view = {
        el:'#app',
        init(){
            this.$el = $(this.el)
        },
        render(song){
            this.$el.find('audio').attr('src',song.url)
            if(song.cover){
                this.$el.css('background-image',`url(${song.cover})`)
                this.$el.find('.disc>.cover').attr('src',song.cover)
            }else{
                let cover_url = 'http://p1.music.126.net/GQ9JkLt6QBaAoLbJ8UOoCQ==/3406287023862462.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0'
                this.$el.css('background-image',`url(${cover_url})`)
                this.$el.find('.disc>.cover').attr('src',cover_url)
            }
            
            this.$el.find('.song-description  h1').text(song.name)

            let {lyrics} = song;
            lyrics.split('\n').map((string)=>{
                let regex = /\[([\d:.]+)\](.+)/;
                let matches = string.match(regex)
                let p = document.createElement('p');
                if(matches){
                    p.textContent = matches[2]
                    let time = matches[1];
                    let pars = time.split(':')
                    let minute = pars[0];
                    let seconds = pars[1];
                    let newtime = parseInt(minute,10)*60 + parseFloat(seconds,10)
                    p.setAttribute('data-time',newtime)
                }else{
                    p.textContent = string;
                }
                this.$el.find('.song-description > .lyric > .lines').append(p)
            })
            this.showlyrics()
            
        },
        showlyrics(){
            let audio = this.$el.find('audio');
            let allP = this.$el.find('.song-description > .lyric > .lines > p')
            audio.on('timeupdate',()=>{
                let time = audio[0].currentTime;
                let p
                for(let i = 0;i<allP.length;i++){
                    if( i === allP.length - 1){
                        p = allP[i]
                        break
                    }else{
                        let currenTime = allP.eq(i).attr('data-time')
                        let nextTime = allP.eq(i+1).attr('data-time')
                        if(time >= currenTime && time < nextTime ){
                            p = allP[i]
                            break
                        }
                    }
                }
                let pHeight = p.getBoundingClientRect().top
                let lineHeight = this.$el.find('.song-description > .lyric > .lines')[0].getBoundingClientRect().top;
                let height = pHeight - lineHeight;
                this.$el.find('.song-description > .lyric > .lines').css({
                    transform:`translateY(${-(height-20)}px)`
                })
                this.active(p) 
            })
        },
        play(){
            this.$el.find('audio')[0].play()
            this.$el.find('.disc-container').addClass('playing')
        },
        pause(){
            this.$el.find('audio')[0].pause()
            this.$el.find('.disc-container').removeClass('playing')
        },
        active(p){
            $(p).addClass('active').siblings().removeClass('active')
        }
    }
    let model = {
        data:{
            song:{
                id:'',
                name:'',
                singer: '',
                url: '',
                cover:'',
                lyrics:''
            },
            status:'pause'  
        },
        getSong(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, Object.assign({id:song.id} ,song.attributes))
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