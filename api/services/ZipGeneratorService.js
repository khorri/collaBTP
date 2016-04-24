/**
 * Created by horri on 09/05/2015.
 */
var fs = require('fs');
  archiver = require('archiver');
module.exports = {
    generate: function (source,destination,callback) {
        if (fs.existsSync('/etc/file')) {
            console.log('Found file');
        }
        var output = fs.createWriteStream(destination);

        var archive = archiver('zip');

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            callback();
        });

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);
        archive.directory(source, false);
        /*archive.bulk([
            { expand: true, cwd: 'fixtures/', src: ['*.txt'] }
        ]);*/
        archive.finalize();
    }
}