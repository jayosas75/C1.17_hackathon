/**
 * Created by Gwenever on 2/8/2017.
 */

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: queryData,
        dataType: 'json',
        type: 'POST',
        headers: {'Api-User-Agent': 'MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4'},
        success: function (data) {
            console.log("Wiki Test:", data);
        }
    });
