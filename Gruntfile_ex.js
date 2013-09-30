//
// Gruntfile.js
//
module.exports = function(grunt) {  // オブジェクトのモジュール化（Node）
	// プラグインの読み込み
	// == grunt.task.loadNpmTasks(pluginName)  // This plug-in must be installed locally via npm.
	grunt.loadNpmTasks("grunt-contrib");  // clean, coffee, compass, compress, concat, connect, copy, cssmin, csslint, handlebars, htmlmin, imagemin, jade, jasmin, jshint, jst, less, qunit, requirejs, sass, stylus, uglify, watch, yuidoc
	// タスク内容設定
	// == grunt.config.init(configObject)
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		// grunt-contrib-compass https://github.com/gruntjs/grunt-contrib-compass
		// settingは持たない。optionsのみ。
		compass: {
			options: {
				// config: "config.rb",  // 読み込みファイル用
				// basePath: "./",  // project_path。初期値はGruntfileと同階層。
				httpPath: "/",
				sassDir: "_scss",  // sassPath
				cssDir: "css",  // cssPath
				imagesDir: "img",  // imagesPath
				relativeAssets: true
			},
			dev: {
				options: {
					environment: "development",
					outputStyle: "expanded",  // nested, expanded, compact, compressed
					noLineComments: false,
					assetCacheBuster: false
				}
			},
			pro: {
				options: {
					environment: "production",
					outputStyle: "compact",  // nested, expanded, compact, compressed
					noLineComments: true
				}
			}
		},
		// grunt-contrib-jshint https://github.com/gruntjs/grunt-contrib-jshint
		jshint: {
			all: ["Gruntfile.js", "js/modules.js", "js/main.js"]  // タスク名は任意
		},
		// grunt-contrib-concat https://github.com/gruntjs/grunt-contrib-concat
		concat: {
			target: {
				src: ["js/modules.js", "js/main.js"],
				dest: "js/_temp.js"
			}
		},
		// grunt-contrib-uglify
		uglify: {
			options: {
				// Mangle names
				//mangle: true,  // 変数名の改変。{ except: ["ID名の配列"] }で例外の登録も可能。
				// Beautifier options
				beautify: {  // trueを指定した場合は、beautify:trueのみを指定したのと同等。
					//beautify: true,  // インデントの展開。
					ascii_only: true  // Unicodeのencode
				},
				// Banner comments
				banner: "/**\n\t<%= pkg.name %>\n */\n"  // ファイル先頭へのテキスト追加。
			},
			target: {
				src: "<%= concat.target.dest %>",
				dest: "js/index.min.js"
			}
		},
		// grunt-contrib-clean https://github.com/gruntjs/grunt-contrib-clean
		clean: {
			target: ["<%= concat.target.dest %>"]
		},
		// grunt-contrib-watch https://github.com/gruntjs/grunt-contrib-watch
		// # options
		// livereload: {true|number} trueかポート番号を指定。trueを指定するとデフォルトポート（35729）。trueを指定するとデフォルトポート（35729）
		// # setting
		// files: {String|Array} 変更を監視するファイル。ファイル指定はfiles format。
		// tasks: {String|Array} 変更後に実行するタスク
		watch: {
			//options: {
			//	livereload: true
			//},
			html: {
				options: {  // compass watchの都合上、各タスク内でoptionsを指定する。
					livereload: true
				},
				files: ["*.html"]  // タスクは何もしない。liveReloadでブラウザをリロードするだけ。
			},
			scss: {
				files: ["_scss/*.scss"],
				tasks: ["compass:dev"]
			},
			css: {
				options: {
					livereload: true
				},
				files: ["css/*.css"]
			},
			js: {
				options: {
					livereload: true
				},
				files: ["js/*.js"],
				//tasks: ["jshint"]
			}
		}
	});
	// タスク登録
	// == grunt.task.registerTask(taskName, taskList)
	grunt.registerTask("default", ["compass:dev", "watch"]);
	grunt.registerTask("deploy", ["compass:pro", "concat", "uglify", "clean"]);
	// taskにはfunctionも登録可能。
	// grunt.task.registerTask(taskName, description, taskFunction)
	grunt.registerTask("test", "register test", function(a, b) {
		// console.logと同じ。
		grunt.log.writeln(this.name, a, b);  // grunt test:1:2  --> test 1 2
	});
	// grunt.task.registerMultiTaskではconfigに設定した内容を指定できる。
	grunt.config.set("log", {  // setとget。propは両方。
		foo: "Hello World",
		bar: [0, 1, 2]
	});
	grunt.registerMultiTask("log", "log test", function() {
		grunt.log.writeln(this.name, this.target, this.data);  // grunt log == grunt log:foo log:bar
	});
	
	// シェルコマンドの実行
	grunt.registerTask("exec", function() {
		var exec = require("child_process").exec;
		// asyncで非同期登録する。
		this.async();  // grunt.task.current.async()
		exec("ls", "-al", function(err, stdout, stderr) {
			console.log("done", stdout);
		});
	});
	
	// 画像圧縮（pngquant）
	grunt.loadNpmTasks("grunt-pngmin");
	grunt.config.set("pngmin", {
		options: {
			ext: ".png",
			force: true,
			speed: 1
		},
		target: {
			// expand: true,     // Enable dynamic expansion.
			// cwd: 'lib/',      // Src matches are relative to this path.
			// src: ['**/*.js'], // Actual pattern(s) to match.
			// dest: 'build/',   // Destination path prefix.
			// ext: '.min.js',   // Dest filepaths will have this extension.
			expand: true,  // srcの階層内で処理する。
			src: ["img/index/**/*.png"]
		}
	});
	grunt.registerTask("pngquant", "pngmin");

};

//
// optionsについては下記URL参照。
// http://gruntjs.com/configuring-tasks#options
//

//
// プラグインの読み込みは以下の方法もある。
//
// var pkg = grunt.file.readJSON("package.json");
// var taskName;
// for (taskName in pkg.devDependencies) {
//   if (taskName.substring(0, 6) === "grunt-") {
//     grunt.loadNpmTasks(taskName);
//   }
// }
//
