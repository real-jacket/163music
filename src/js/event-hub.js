window.eventHub = {
    events:{

    },
    emit(eventNanme,data){//发布
        for(let key in this.events){
            if(key === eventNanme){
                let fnList = this.events[key];
                fnList.map((fn)=>{
                    fn.call(undefined,data);
                });
            }
        }
    },
    on(eventNanme,fn){//订阅
        if(this.events[eventNanme] === undefined){
            this.events[eventNanme] = [];
        };
        this.events[eventNanme].push(fn);
    },
    off(){

    }
}