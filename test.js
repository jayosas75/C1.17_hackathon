/**
 * Created by yaeri on 2/8/2017.
 */
$('button').on('click',function(){
    console.log('youtube!');
    var flowerPot = $("#flowerPot");
    $.ajax({
        url: 'http://learning-fuze.github.io/json_files/json3.json',
        dataType: 'json',
        method: 'get',
        cache: false,
        success: function(response){
            //console.log(response.length);
            if(response.success===true){
                for(var i=0;i < response.data.length; i++){
                    console.log(response.data[i]);
                    var container = $("<div>",{
                        class:'flower_container'
                    });
                    var figure = $("<figure>");
                    var img = $("<img>",{
                        src:response.data[i].image_url
                    });
                    figure.append(img);
                    var figcaption = $("<figcaption>");
                    var title = $("<h2>",{
                        text: response.data[i].name
                    });
                    var subTitle = $("<h3>",{
                        text: response.data[i].alt_name
                    });
                    figcaption.append(title, subTitle);

                    container.append(figure,figcaption);
                    flowerPot.append(container);

                }
            }
        }  //end of the ajax success handler
    });  //end of the ajax call
}); //end of button click handler assignment