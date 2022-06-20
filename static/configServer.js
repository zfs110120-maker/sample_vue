window.g = {
    serverUrl : "",
    // mapSocket: "ws://192.168.3.5:8089/websocket2/",  
    // videoSocket: "ws://192.168.3.5:8089/websocket/",
    // echartWebsocket:"ws://192.168.3.5:8089/linewebsocket/",   //三维折线图websocket
    // devCodeWebsocket: "ws://192.168.3.5:8089/linewebsocket/",  //二维设备仪表数据
    // video3dWebsocket: "ws://192.168.3.5:8089/videoWebsocket/",  //“三维视图”中 设备对应视频通讯
    // wearningOnTimeWebsocket: "ws://192.168.3.5:8089/warnWebsocket/",  //“三维视图”中 设备对应视频通讯
    // linkage3DAnd2DWebsockte: "ws://192.168.3.5:8089/flowsheetWebsocket/",  //二维三维联动websocket
    echartsConfig: ['10%','10%'],   //折线图上下空余
    unitySendUserId: "ws://192.168.3.5:8092/unityWebsocket/",  // unity3d发送用户id的websocket
    //unitySendUserId: "192.168.3.13:8089",  // unity3d发送用户id的websocket
    finallyWebsocket: "ws://192.168.3.5:8092/frontWebsocket/" ,  //home页面的websocket路径
    
    policeServerUrl : "http://192.168.3.51:8087/",      //采集以后调用的服务器
    videoServerUrl : "http://192.168.3.10:10800",      //
    // collectionServerUrl : "http://192.168.3.13:8086/",    //设置阈值以及报警以后调用的服务器
    // mapSocket: "ws://192.168.3.12:8081/websocket2/",
    // videoSocket: "ws://192.168.3.12:8081/websocket/",
    // chartSocket: "ws://192.168.3.12:8081/websocket/",
    // serverUrl1 : "http://192.168.3.13:8087/",
    // temporaryUrl : ''


  }