var ytdl = require('ytdl-core');
var fs = require('fs');

var downloadButton =  document.querySelector('#download-btn');
var errorMessage = document.querySelector('.error-message');
var videoThumbnailHolder = document.querySelector('.video-thumbnail');
var videoTitleHolder = document.querySelector('.video-title');
downloadButton.addEventListener('click', function(e) {
  e.preventDefault();
  var videoUrl = document.querySelector('#url-input').value;

  //check if videoUrl is a correct youtube link

  getVideoInfo(videoUrl);

});

getVideoInfo = function(videoUrl) {

  ytdl.getInfo(videoUrl, {quality:22}, function(error, info) {
    if(error) {
      errorMessage.className = 'error-message';
    }
    else {
      displayInfo(info);
      downloadVideo(info);
    }
  });

}

displayInfo = function(info) {
  videoTitleHolder.innerHTML = info.title;
  var thumbnail = new Image();
  thumbnail.src = info.iurlmq;
  videoThumbnailHolder.appendChild(thumbnail);
}
/**
 * Converst bytes to human readable unit.
 * Thank you Amir from StackOverflow.
 *
 * @param {Number} bytes
 * @return {String}
 */
toHumanSize = function(bytes) {
  var units = ' KMGTPEZYXWVU';
  if (bytes <= 0) { return 0; }
  var t2 = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 12);
  return (Math.round(bytes * 100 / Math.pow(1024, t2)) / 100) +
          units.charAt(t2).replace(' ', '') + 'B';
};

downloadVideo = function(info) {
    var videoTitle = info.title;
    var url = info.loaderUrl;
    var videoStream = ytdl(url);

    //save to hard disk
    videoStream.pipe(fs.createWriteStream(videoTitle + '.mp4'));

    //check progress
    videoStream.on('response', function(res) {
      var size = res.headers['content-length'];
      var dataRead = 0;
      videoStream.on('data', function(data) {
        dataRead += data.length;
        var dataAvailable = (dataRead / size)
        var percent = Math.round(dataAvailable * 100);
        var progressBar = document.querySelector('.progress-bar');
        progressBar.innerHTML = percent + '%';
        progressBar.style.width = percent + '%';
      });
    });
}
