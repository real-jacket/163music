{
    let view = {
        el: '.playList-container',
        template: `
            <ul class="songList"> 
            </ul>
            
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template);
            let {songlists,selectSonglistId} = data;
            let liList = songlists.map((songlist)=> {
                let $li = $('<li></li>').text(songlist.title).attr('data-x-id',songlist.id)
                if(songlist.id === selectSonglistId){
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
            songlists:[],
            selectSonglistId:undefined
        },
        find(){
            var query = new AV.Query('SongList');
            return query.find().then((x)=>{
                this.data.songlists = x.map((songlist)=>{
                    return {id:songlist.id,...songlist.attributes}
                })
            })
        }
    };
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)
            this.getAllsonglists();
            this.bindEventHub();
            this.bindEvents();
        },
        getAllsonglists(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            });
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songlistId = $(e.currentTarget).attr('data-x-id')
                
                this.model.data.selectSonglistId = songlistId
                this.view.render(this.model.data)
                
                let songlist
                let songlists = this.model.data.songlists
                for(let i = 0; i<songlists.length;i++){
                    if(songlists[i].id === songlistId){
                        songlist = songlists[i]
                    }
                }
                window.eventHub.emit('click',JSON.parse(JSON.stringify(songlist)));
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songlists.push(songData);
                this.view.render(this.model.data)
                
            });
            window.eventHub.on('new',()=>{
                this.model.data.selectSonglistId = undefined;
                this.view.render(this.model.data)
            });
            window.eventHub.on('update',(songlist)=>{
                let songlists = this.model.data.songlists;
                for(let i = 0;i<songlists.length;i++){
                    if(songlists[i].id === songlist.id){
                        songlists[i] = songlist
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view,model);
}