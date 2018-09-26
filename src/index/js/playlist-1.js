{
    let view = {
        el:'section.summary',
        init(){
            this.$el = $(this.el)
        },
        template:`
        <header class="cover">
                <div class="backgroundimg"></div>
                <img class="imgcover" src={{playlist.cover}} alt="">
                <div class="background">
                    <h2 class="title">{{playlist.title}}</h2>
                    <div class="author">
                        <img src="http://p1.music.126.net/QWMV-Ru_6149AKe0mCBXKg==/1420569024374784.webp?imageView&thumbnail=60x0&quality=75&tostatic=0&type=webp" alt="">
                        网易云音乐
                    </div> 
                </div>
        </header>
        <div class="description">
            <p>简介：{{playlist.description}}</p>
        </div>
        `,
        render(playlist){
            let $template = this.template
                .replace('{{playlist.title}}',playlist.title)
                .replace('{{playlist.cover}}',playlist.cover)
                .replace('{{playlist.description}}',playlist.description)
            this.$el.append($template)
            if(playlist.cover){
                this.$el.find('.cover>.backgroundimg').css('background-image',`url(${playlist.cover})`)
            }else{
                let cover_url = 'http://p1.music.126.net/GQ9JkLt6QBaAoLbJ8UOoCQ==/3406287023862462.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0'
                this.$el.find('.cover>.backgroundimg').css('background-image',`url(${cover_url})`)
            }
        }
    }
    let model ={
        data:{
            playlist:{
                id:'',
                title:'',
                cover:'',
                description:''
            }
        },
        getSonglist(id){
            var query = new AV.Query('SongList');
            return query.get(id).then((playlist) => {
                Object.assign(this.data.playlist, Object.assign({id:playlist.id} ,playlist.attributes))
                return playlist;
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            let id = this.getSonglistId();
            this.model.getSonglist(id).then(()=>{
                this.view.render(this.model.data.playlist)
            });
        },
        getSonglistId(){
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