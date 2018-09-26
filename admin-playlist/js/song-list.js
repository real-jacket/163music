{
    let view = {
        el: '.songList-container',
        template: `
            <h1>歌单歌曲列表</h1>
            <ul class="songList"> 
            </ul>
            <div class='controller'>
                <button class='cancel'>取消</button>
                <button class='ensure'>确定</button>
            </div>
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
        },
        show(){
            $(this.el).addClass('active')
        },
        hidden(){
            $(this.el).removeClass('active')
        }
    };
    let model = {
        data:{
            songs:[],
            selectSongId:undefined,
            playlist:undefined
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
                console.log(song)
                $(this.view.el).on('click','button',(e)=>{
                    console.log(e.currentTarget)
                    let $selectButton = $(e.currentTarget);
                    console.log($selectButton.html())
                    if($selectButton.html() === '确定'){
                        //假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
                        let songlist = AV.Object.createWithoutData('SongList', this.model.data.playlist.id);
                        let song = new AV.Object.createWithoutData('Song',this.model.data.selectSongId);
                        song.set('dependent', songlist);
                        song.save().then((song)=>{
                            console.log(song)
                        })
                    }else{
                        this.view.hidden()
                    }

                })

            })
        },
        bindplaylist(){

        },
        bindEventHub(){
            window.eventHub.on('addClick',(songList)=>{
                this.view.show()
                this.model.data.playlist = songList
                console.log(this.model.data.playlist)
            })
        }
    }

    controller.init(view,model);
}