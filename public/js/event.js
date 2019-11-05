$(document).ready(function() {
    function getRecipients() {
        $.get("/getvidsrcs", function(data) {
          let urls = data;
          let $videos= $('#videos')
          for(let i = 0; i < urls.length; i++ )
          $videos.append(`  
          <div class="col-sm">     
          <video width="320" height="240" controls>
          <source src="${urls[i]}" type="video/webm">
          </video></div>`);
        });
      }
})