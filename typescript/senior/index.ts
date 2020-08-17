type NetworkLoadingState = {
    success:boolean;
    code:string;
    data:{
        list:string[]
    }
}

type NetWorkFailedState = {
    success?:boolean;
    code:number
}


type NetworkState = NetWorkFailedState&NetworkLoadingState;


