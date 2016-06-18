一些openlayer3中开发中遇到的一些坑，在这里记录下来，让ol3开发的小伙伴避免下次遇到我同样的坑，一直会有补充，下面列表根据上传demo会持续更新...<br/>
在这里index.html用到了requirejs来进行代码模块化管理<br/>
1.index.html集成了ol3-slide(https://github.com/Turbo87/sidebar-v2)<br/>,效果图如下图所示：<br/>
![image](https://github.com/alonso-ecit/ol3/blob/master/images/readme/index.png)<br/>

2.面上画ICON并同时保留填充色和边界（详见drawIconOnPolygon.html)<br/>
  定义ol.style.Style可以返回一个数组，用来自定义各种样式，效果图如下图所示：<br/>
   ![image](https://github.com/alonso-ecit/ol3/blob/master/images/readme/drawIconOnPolygon.png)

