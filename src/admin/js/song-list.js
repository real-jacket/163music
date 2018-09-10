{
    let view = {
        el: '.songList-container',
        template: `
            <ul class="songList"> 
            </ul>
            
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template);
            let {songs,selectSongId} = data;
            let liList = songs.map((song)=> {
                let $li = $('<li></li>').text(song.name).attr('data-x-id',song.id)
                if(song.id === selectSongId){
                    $li.addClass('active')
                }
                return $li 
            })
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        }
    };
    let model = {
        data:{
            songs:[],
            selectSongId:undefined
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((x)=>{
                this.data.songs = x.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
            })
        }
    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            this.getAllSongs();
            this.bindEventHub();
            this.bindEvents();
        },
        getAllSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            });
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songId = $(e.currentTarget).attr('data-x-id')
                
                this.model.data.selectSongId = songId
                this.view.render(this.model.data)
                
                let song
                let songs = this.model.data.songs
                for(let i = 0; i<songs.length;i++){
                    if(songs[i].id === songId){
                        song = songs[i]
                    }
                }
                window.eventHub.emit('click',JSON.parse(JSON.stringify(song)));
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData);
                this.view.render(this.model.data)
                
            });
            window.eventHub.on('new',()=>{
                this.model.data.selectSongId = undefined;
                this.view.render(this.model.data)
            });
            window.eventHub.on('update',(song)=>{
                let songs = this.model.data.songs;
                for(let i = 0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        songs[i] = song
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view,model);
}