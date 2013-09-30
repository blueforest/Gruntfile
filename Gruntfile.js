//
// Gruntfile.js
//
module.exports = function(grunt) {
	// プラグインの読み込み
	// clean, coffee, compass, compress, concat, connect, copy, cssmin, csslint, handlebars, 
	// htmlmin, imagemin, jade, jasmin, jshint, jst, less, qunit, requirejs, sass, stylus, uglify, watch, yuidoc
	grunt.loadNpmTasks("grunt-contrib");
	// タスク内容設定
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
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
		jshint: {
			all: ["Gruntfile.js", "js/modules.js", "js/main.js"]  // タスク名は任意
		},
		concat: {
			target: {
				src: ["js/modules.js", "js/main.js"],
				dest: "js/_temp.js"
			}
		},
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
		clean: {
			target: ["<%= concat.target.dest %>"]
		},
		// grunt-contrib-watch https://github.com/gruntjs/grunt-contrib-watch
		// # options
		// livereload: {true|number} trueかポート番号を指定。trueを指定するとデフォルトポート（35729）。
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
