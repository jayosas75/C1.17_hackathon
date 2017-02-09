// $.ajax({
//     url: 'https://en.wikipedia.org/w/api.php',
//     data: queryData,
//     dataType: 'json',
//     type: 'POST',
//     headers: {'Api-User-Agent': 'MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4'},
//     success: function (data) {
//         console.log("Wiki Test:", data);
//     }
// });

// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://en.wikipedia.org/w/api.php",
//     "method": "POST",
//     "headers": {
//         "content-type": "application/x-www-form-urlencoded",
//         "'api-user-agent'": "'MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4'",
//         "cache-control": "no-cache",
//         "postman-token": "dac9444a-e6de-2c0c-7193-7d0a5c4facf6"
//     }
// };
//
// $.ajax(settings).done(function (response) {
//     console.log(response);
// });

// var settings = {
//     "async": true,
//     "crossDomain": true,
//     "url": "https://en.wikipedia.org/w/api.php",
//     "method": "POST",
//     "headers": {
//         "content-type": "application/x-www-form-urlencoded",
//         "api-user-agent": "MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4",
//         "cache-control": "no-cache",
//         "postman-token": "6d8817d5-4e0e-a0f7-d26c-6fa4718e4cdf"
//     }
// }
//
// $.ajax(settings).done(function (response) {
//     console.log(response);
// });



Weglot.setup({
    api_key: 'wg_2fce281d81d90095a77029ebf6244897',
    originalLanguage: 'en',
    destinationLanguages : 'fr,es,ar,it,ko,de,ru,pt,ja,zh',
});