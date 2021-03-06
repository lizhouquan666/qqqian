let layedit;
let index;
$(function () {
    let id = sessionStorage.getItem("newsId");
    let res = myAjax("http://localhost:8080/news/findById", {id: id}, "get");
    setProductData(res.data);
});
layui.use(['layedit', 'upload', 'element', 'form', 'layer', 'jquery', 'laydate'],
    function () {
        $ = layui.jquery;
        var form = layui.form
            , element = layui.element
            , upload = layui.upload
            ,layer = layui.layer;


        layedit = layui.layedit;


        layedit.set({
            uploadImage: {
                url: 'http://localhost:8080/upload' //接口url
                , type: '' //默认post
                , crossDomain:true,
                xhrFields: {
                    withCredentials: true
                }
            }
        });
        index = layedit.build('demo'); //建立编辑器

        //常规使用 - 普通图片上传
        var uploadInst = upload.render({
            elem: '#test1'
            , url: 'http://localhost:8080/upload'//后台访问的地址，需要将文件传到服务器，
            , crossDomain:true,
            xhrFields: {
                withCredentials: true
            }
            , before: function (obj) {
                //预读本地文件示例，不支持ie8
                // 将上传的图片预览到下面的图片框
                obj.preview(function (index, file, result) {
                    $('#demo1').attr('src', result); //图片链接（base64）
                });

            }
            , done: function (res) {
                //如果上传失败
                if (res.code > 0) {
                    return layer.msg('上传失败');
                }
                console.log(res);
                sessionStorage.setItem("productImgHref", res.data.src);
                //上传成功的一些操作
                //……
            }


        });
        //监听提交
        form.on('submit(update)',
            function (data) {
                data = data.field;
                //发异步，把数据提交给java
                //提交之前，需要重新设置爱好
                //拿到复选框的所有的title的值
                data.content = layedit.getContent(index);
                data.id=sessionStorage.getItem("newsId");
                console.log(data);
                let res = myAjax("http://localhost:8080/news/update", data);
                console.log(res);
                if (res != undefined && res.count == 1) {
                    layer.alert("更新成功", {
                            icon: 6
                        },
                        function () {
                            //关闭当前frame
                            xadmin.close();
                            // 可以对父窗口进行刷新
                            xadmin.father_reload();
                        });
                } else {
                    layer.alert("更新失败");
                }
                return false;
            });

    });
//图片和富文本
function setProductData(data) {
    console.log(data);
    layui.use(['layedit', 'upload', 'element', 'form', 'layer', 'jquery', 'laydate'],
        function () {
            $ = layui.jquery;
            var form = layui.form
                , layer = layui.layer
                ,layedit = layui.layedit
                , laydate = layui.laydate;

            $("#name").val(data.name);
            $("#newsTypeName").val(data.news_Id);
            $("#demo1").attr("src",data.imgHref);
            layedit.setContent(index,data.content);
            $('input:radio[name=enable][value=' + data.enable + ']').attr("checked", true);
            layui.form.render();
        });
}
