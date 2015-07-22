module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: {
				src: ["build"]
			}
		},
		sass: {
			dist: {
				options: {
					style: 'expanded',
					sourcemap: 'auto'
				},
				files: {
					'src/css/main.css': 'src/sass/main.scss'
				}
			}
		},
		copy: {
			build: {
				cwd: 'src',
				src: ['**/*', '!**/sass/**', '!**/config.rb'],
				dest: 'build',
				expand: true
			}
		},
		watch: {
			files: ['src/**/*', '!src/css/main.css**'], //Don't watch css, because the sass task will modify it --> infinite loop
			tasks: ['default']
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('default', ['clean', 'sass', 'copy']);
};
