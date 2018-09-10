{
    let view = {
        el:'section.latestMusic',
        init(){
            this.$el = $(this.el);
        },
        tempale:`
            
        `,
        render(data){
            let {songs} = data;
            songs.map((song)=>{
                let $li = $(`
                <li>
                    <a href="./song.html?id=1">
                        <h3>${song.name}</h3>
                        <p>${song.singer}-${song.name}</p>
                        <svg class="play">
                            <use xlink:href="#icon-play-circled"></use>
                        </svg>
                    </a>
                </li>
                `);
                this.$el.find('ol#latestMusic').append($li)
            })
        }
    }
    let model = {
        data:{
            songs:[]
        },
        fetchAll(){
            var query = new AV.Query('Song');
            return query.find().then((x)=>{
                this.data.songs = x.map((song)=>{
                    return {id:song.id,...song.attributes}
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
                this.view.render(this.model.data)
            })
        }
    }

    controller.init(view,model);
}