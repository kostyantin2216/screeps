module.exports = function (grunt) {
    require("time-grunt")(grunt);

    // Pull defaults (including username and password) from .screeps.json
    var config = require("./.screeps.json");

    // Allow grunt options to override default configuration
    var branch = grunt.option("branch") || config.branch;
    var email = grunt.option("email") || config.email;
    var password = grunt.option("password") || config.password;
    var ptr = grunt.option("ptr") ? true : config.ptr;
    var private_directory =
        grunt.option("private_directory") || config.private_directory;
    var simulation_directory = 
        grunt.option("simulation_directory") || config.simulation_directory;

    var currentdate = new Date();
    grunt.log.subhead("Task Start: " + currentdate.toLocaleString());
    grunt.log.writeln("Branch: " + branch);

    // Load needed tasks
    grunt.loadNpmTasks("grunt-screeps");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-string-replace");
    grunt.loadNpmTasks("grunt-file-append");
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-rsync");

    grunt.initConfig({
        // Push all files in the dist folder to screeps. What is in the dist folder
        // and gets sent will depend on the tasks used.
        screeps: {
            options: {
                email: email,
                password: password,
                branch: branch,
                ptr: ptr,
            },
            dist: {
                src: ["dist/*.js"],
            },
        },

        // Copy files to the folder the client uses to sink to the private server.
        // Use rsync so the client only uploads the changed files.
        rsync: {
            options: {
                args: ["--verbose", "--checksum"],
                exclude: [".git*"],
                recursive: true,
            },
            private: {
                options: {
                    src: "./dist/",
                    dest: private_directory,
                },
            },
            simulation: {
                options: {
                    src: "./dist/",
                    dest: simulation_directory,
                },
            }
        },

        // Copy all source files into the dist folder, flattening the folder
        // structure by converting path delimiters to underscores
        // while updating all requires in these files
        "string-replace": {
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: "**",
                    dest: "dist/",
                    filter: "isFile",
                    rename: function (dest, src) {
                        // Change the path name utilize underscores for folders
                        return dest + src.replace(/\//g, "_");
                    },
                }, ],
                options: {
                    replacements: [{
                        pattern: /require\(['"](.*?)['"]\)/gi,
                        replacement: function (match, p1) {
                            let firstLetterIndex = 0;
                            while (
                                p1[firstLetterIndex] === "." ||
                                p1[firstLetterIndex] === "/"
                            )
                                firstLetterIndex++;
                            const module = p1.substr(firstLetterIndex).replace(/\//g, "_");
                            return `require('${module}')`;
                        },
                    }, ],
                },
            },
        },

        // Add version variable using current timestamp.
        file_append: {
            versioning: {
                files: [{
                    append: "\nmodule.exports.VERSIONS.SCRIPTS_BUILD = " + currentdate.getTime() + ";\n",
                    input: "dist/constants.js",
                }, ],
            },
        },

        // Remove all files from the dist folder.
        clean: {
            dist: ["dist"],
        },

        // Apply code styling
        jsbeautifier: {
            modify: {
                src: ["src/**/*.js"],
                options: {
                    config: ".jsbeautifyrc",
                },
            },
            verify: {
                src: ["src/**/*.js"],
                options: {
                    mode: "VERIFY_ONLY",
                    config: ".jsbeautifyrc",
                },
            },
        },

        watch: {
            public: {
                files: ['src/**/*.js'],
                tasks: ['public'],
            },
            private: {
                files: ['src/**/*.js'],
                tasks: ['private'],
            },
            simulation: {
                files: ['src/**/*.js'],
                tasks: ['simulation'],
            }
        },
    });

    grunt.registerTask("build", [
        "clean",
        "string-replace",
        "file_append:versioning",
    ]);
    grunt.registerTask("public", [
        "build",
        "screeps",
    ]);
    grunt.registerTask("private", [
        "build",
        "rsync:private",
    ]);
    grunt.registerTask("simulation", [
        "build",
        "rsync:simulation",
    ]);
    grunt.registerTask("test", ["jsbeautifier:verify"]);
    grunt.registerTask("pretty", ["jsbeautifier:modify"]);
};