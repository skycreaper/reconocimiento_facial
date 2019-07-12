var albumBucketName = 'faces.demo.htsoft';
var bucketRegion = 'us-east-1';
var fotoName = 'foto5.jpg';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.Credentials('AKIAZZPKWOZPG5Q34FUF', 'PgITPJdFJmIWCT6Iupz7kwKMGw6lLnYDwt8GpTbd')
});
var rekognition = new AWS.Rekognition();

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: albumBucketName }
});


function uploadPhoto(blobData) {
  fotoName = 'photoDemo.jpg';
  var albumPhotosKey = 'fotosAI/';
  var photoKey = albumPhotosKey + fotoName;
  s3.upload({
    Key: photoKey,
    Body: blobData,
    ACL: 'private'
  }, function (err, data) {
    if (err) {
      return alert('Hubo en error cargando la foto: ', err.message);
    }
    else {
      console.log({ "dta: ": data });
      var params2 = {
        Image: {
          S3Object: {
            Bucket: albumBucketName,
            Name: photoKey,
          }
        },
        Attributes:
          ["ALL", "DEFAULT"]
      };
      rekognition.detectFaces(params2,
        function (err, data) {
          if (err) {
            console.log(err, err.stack); // an error occurred
          }
          else {
            console.log({ "datos: ": data })
            for (let i = 0; i < data.FaceDetails.length; i++) {
              const element = data.FaceDetails[i];
              console.log(element);
              var mejorEmocion = element.Emotions[0];
              for (let j = 1; j < element.Emotions.length; j++) {
                const element2 = element.Emotions[j];
                if (mejorEmocion.Confidence < element2.Confidence) {
                  mejorEmocion = element2;
                }
                //console.log("emotions:" , element2)
              }
              console.log(mejorEmocion)
              var x = function () {
                
                switch (mejorEmocion.Type) {
                  case "HAPPY":
                      $("#texto").text("Estás Feliz!! :D :D :D ")
                      $("#buttons").attr('disabled','disabled');
                      $("#buttons").children().attr("disabled","disabled")
                    break;
                  case "SAD":
                      $("#texto").text("Estás triste D: D: D:")
                      $("#buttons").attr('disabled','disabled');
                      $("#buttons").children().attr("disabled","disabled")
                    break;

                  default:
                      $("#texto").text("Mejor tomate otra foto :/")                    
                    break;
                }
              }()
            }

          }

        });
    }
  });
}


