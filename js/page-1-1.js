{
    let view = {
        el:'section.playlists',
        init(){
            this.$el = $(this.el)
        },
        template:`
        <li>
            <a href="./playlist.html?id={{playlist.id}}">
                <img src={{playlist.cover}} alt="">
                <p>{{playlist.title}}</p>
            </a>
        </li>
        `,
        render(data){
            let {playlists} = data;
            playlists.map((playlist)=>{
                let $li = $(this.template
                    .replace('{{playlist.title}}',playlist.title)
                    .replace('{{playlist.cover}}',playlist.cover)
                    .replace('{{playlist.id}}',playlist.id)
                ); 
                this.$el.find('#latestPlaylists').append($li)
            })
        }
    }
    let model ={
        data:{
        },
        fetchAll(){
            var query = new AV.Query('SongList');
            return query.find().then((x)=>{
                this.data.playlists = x.map((playlist)=>{
                    return Object.assign({id:playlist.id} ,playlist.attributes)
                })
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.view.init();
            this.getAllsongs();
        },
        getAllsongs(){
            this.model.fetchAll().then(()=>{
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view,model);
}