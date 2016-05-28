var FMApp = angular.module('FMApp', ['ur.file']);
// var cloudPort = 8080;
// var baseUrl = "http:\/\/localhost:";
var cloudUrl = baseUrl + cloudPort + "\/";
var port; 

FMApp.controller('FileManagerCtr', ['$scope', '$http', '$location',
  function ($scope, $http, $location) {
    var FM = this;
    FM.curHashPath = '#/';          // hash in browser url
    FM.curFolderPath = '/';         // current relative folder path
    FM.curBreadCrumbPaths = [];     // items in breadcrumb list, for each level folder
    FM.curFiles = [];               // files in current folder

    FM.selecteAll = false;          // if select all files
    FM.selection = [];              // selected files
    FM.renameName = '';             // new name for rename action
    FM.uploadFile = null;           // will upload file
    FM.newFolderName = '';
    FM.successData = '__init__';
    FM.errorData = '__init__';


    var hash2paths = function (relPath) {
      var paths = [];
      var names = relPath.split('/');
      var path = '#/';
      paths.push({name: 'Home', path: path});
      for (var i=0; i<names.length; ++i) {
        var name = names[i];
        if (name) {
          path = path + name + '/';
          paths.push({name: name, path: path});
        }
      }
      return paths;
    };

    var humanSize = function (size) {
      var hz;
      if (size < 1024) hz = size + ' B';
      else if (size < 1024*1024) hz = (size/1024).toFixed(2) + ' KB';
      else if (size < 1024*1024*1024) hz = (size/1024/1024).toFixed(2) + ' MB';
      else hz = (size/1024/1024/1024).toFixed(2) + ' GB';
      return hz;
    };

    var humanTime = function (timestamp) {
      var t = new Date(timestamp);
      return t.toLocaleDateString() + ' ' + t.toLocaleTimeString();
    };

    var setCurFiles = function (relPath) {
//      alert("relPath" + relPath);
      $http.get(cloudUrl + "api" + relPath)
        .success(function (data) {
//          alert("success");
          var files = data;
          files.forEach(function (file) {
            file.relPath = relPath + file.name;
            if (file.folder) file.relPath += '/';
            file.selected = false;
            file.humanSize = humanSize(file.size);
            file.humanTime = humanTime(file.mtime);
          });
          FM.curFiles = files;
        })
        .error(function (data, status) {
          alert('setCurFiles Error: ' + status + data);
        })
    };

    var handleHashChange = function (hash) {
      if (!hash) {
        return $location.path('/');
      }
      //console.log('Hash change: ' + hash);
      var relPath = '/';//hash.slice(1);
      FM.curHashPath = hash;
      FM.curFolderPath = relPath;
      FM.curBreadCrumbPaths = hash2paths(relPath);
      setCurFiles(relPath);
    };

    $scope.$watch(function () {
      return location.hash;
    }, function (val) {
      handleHashChange(val);
    });

    // listening on file checkbox
    $scope.$watch('FM.curFiles|filter:{selected:true}', function (nv) {
      FM.selection = nv.map(function (file) {
        return file;
      });
    }, true);

    $scope.$watch('FM.selectAll', function (nv) {
      FM.curFiles.forEach(function (file) {
        file.selected = nv;
      });
    });

    $scope.$watch('FM.successData', function () {
      if (FM.successData === '__init__') return;
      $('#successAlert').show();
      $('#successAlert').fadeIn(3000);
      $('#successAlert').fadeOut(3000);
    });

    $scope.$watch('FM.errorData', function () {
      if (FM.errorData === '__init__') return;
      $('#errorAlert').show();
    });

    var httpRequest = function (method, url, params, data, config) {
      var conf = {
        method: method,
        url: url,
        params: params,
        data: data,
        timeout: 10000
      };
      for (var k in config) {
        if (config.hasOwnProperty(k)) {
          conf[k] = config[k];
          console.log("k: "+k+ " value: "+config[k])
        }
      }
      console.log('request url', url);
      if(method === "DELETE"){
        
      }
      else{
        $http(conf)
        .success(function (data) {
          FM.successData = data;
          handleHashChange(FM.curHashPath);
          console.log("http request success");
        })
        .error(function (data, status) {
          FM.errorData = ' ' + status + ': ' + data;
          console.log("http request failed");
        });
      }
      
    };

    var downloadFile = function (file) {
      window.open(cloudUrl + 'api' + file.relPath);
    };

    FM.clickFile = function (file) {
      if (file.folder) {
        // open folder by setting url hash
        $location.path(decodeURIComponent(file.relPath));
      }
      else {
        // download file
        downloadFile(file);
      }
    };

    FM.insertFile = function (file) {
      //TODO:
      //pass the address of current file to client
      file.relPath = file.relPath.replace(/[ ]/g,"%20");
      alert(baseUrl+cloudPort +"/cloud/"+Email+"/"+file.relPath);
      var extension = file.relPath.substring(file.relPath.lastIndexOf('.'), file.relPath.length).toLowerCase();
      if(extension == ".png" || extension == ".jpg" || extension == ".jpeg" || extension == ".bmp" || extension == ".gif"){
        $('#editor').append("<img src = "+baseUrl+"3000" +"/cloud/"+Email+file.relPath+"></img> ");
      }
      else if(extension == ".mp3" || extension == ".wma" || extension == ".wav"){
        $('#editor').append("<embed src = "+baseUrl+"3000" +"/cloud/"+Email+file.relPath+" width=300 height=100></embed> ");
      }
      else if(extension == ".avi" || extension == ".mp4" || extension == ".wmv" || extension == ".rmvb" || extension == ".rm"){
        $('#editor').append("<video src = "+baseUrl+"3000" +"/cloud/"+Email+file.relPath+" width=800 height=600></video> ");
      }
      else{
        $('#editor').append("<iframe src = "+baseUrl+"3000" +"/cloud/"+Email+file.relPath+" width=600 height=800></iframe> ");
      }
      
      // $("#")

    };

    FM.download = function () {
      for (var i in FM.selection) {
        downloadFile(FM.selection[i]);
      }
    };

    FM.delete = function () {
      for (var i in FM.selection) {
        var relPath = FM.selection[0].relPath;
        var url =  cloudUrl + 'api' +  relPath;
        console.log("delete url: "+url);
        httpRequest('PUT', url, {type: 'DELETE'}, null);
      }
    };

    FM.move = function (target) {
      var url = cloudUrl + 'api' + target;
      var src = FM.selection.map(function (file) {
        return file.relPath;
      });
      httpRequest('PUT', url, {type: 'MOVE'}, {src: src});
    };

    FM.rename = function (newName) {
      var url = cloudUrl + 'api' + FM.selection[0].relPath;
      var target = FM.curFolderPath + newName;
      console.log('rename target', target);
      httpRequest('PUT', url, {type: 'RENAME'}, {target: target});
    };

    FM.createFolder = function (folderName) {
      var url = cloudUrl + 'api' + FM.curFolderPath + folderName;
      httpRequest('POST', url, {type: 'CREATE_FOLDER'}, null);
    };

    FM.upload = function () {
      console.log('Upload File:', FM.uploadFile);
      var formData = new FormData();
      formData.append('upload', FM.uploadFile);
      var url = cloudUrl + 'api' + FM.curFolderPath + FM.uploadFile.name;
      // alert("folder path" + FM.curFolderPath);
      httpRequest('POST', url, {type: 'UPLOAD_FILE'}, formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });
    };

    FM.btnDisabled = function (btnName) {
      switch (btnName) {
        case 'download':
          if (FM.selection.length === 0) return true;
          else {
            for (var i in FM.selection) {
              if (FM.selection[i].folder) return true;
            }
            return false;
          }
        case 'delete':
        case 'move':
          return FM.selection.length === 0;
        case 'rename':
          return FM.selection.length !== 1;
        case 'upload_file':
        case 'create_folder':
          return false;
        case 'insert':

        default:
          return true;
      }
    }
  }
]);
