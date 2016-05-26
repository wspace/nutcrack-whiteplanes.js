// whiteplanes.js
//
// (The MIT License)
//
// Copyright © 2016 Takuya Katsurada(https://github.com/nutcrack)
//
// Permission is hereby granted, free of charge,
// to any person obtaining a copy of this software and
// associated documentation files (the 'Software'),
// to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

var Commands = require('./command');

var Whiteplanes = function(source){
    var SPACE   = " ";
    var TAB     = "\t";
    var NEWLINE = "\n";
    var token   = [SPACE, TAB, NEWLINE];

    this.code = source;
    var source = source.split('').filter(function(element){
        return (token.indexOf(element) >= 0) ? true : false;
    });

    var parameter = function(code){
        var param  = "";
        var tokens = code.split('');
        for(var i = 0; i < tokens.length; i++){
            var chr = tokens[i];
            if(chr === SPACE){
                param += "0";
            } else if(chr === TAB) {
                param += "1";
            } else {
                return param;
            }
        }
    }

    this.commands = (function(source){
        var cursor = 0;
        var commands = [];
        while(cursor < source.length) {
            var token = source.slice(cursor);
            var current = undefined;

            Object.keys(Commands).forEach(function(name) {
                var command  = Commands[name];
                var pattern  = "(^" + command.token + ")" + (command.isRequiredParameter ? "([\\s]*)" : "");
                var detected = (new RegExp(pattern)).exec(token);

                if(current == undefined && detected !== null) {
                    var step  = command.token.length;
                    var param = null;
                    if(command.isRequiredParameter) {
                        param = parameter(detected[2]);
                        step += param.length + 1;
                    }
                    commands.push({ name: name, value: param, location: commands.length });
                    cursor += step;
                    current = name;
                }
            });
        }
        return commands;
    })(source.join(''));
}

Whiteplanes.prototype = Object.create(null, {
    constructor: {
        value: Whiteplanes,
        enumerable: false
    },

    execute: {
        value: function(context) {
            var isRegister = function(cmd){ return cmd.name == "register" }
            this.commands.filter(isRegister).forEach(function(cmd){
                Commands[cmd.name].process(context, cmd);
            })

            while(context.counter < this.commands.length) {
                var command = this.commands[context.counter];
                if(command.name != "register") {
                    Commands[command.name].process(context, command);
                }
                context.counter += 1;
            }
        }
    }
});
module.exports = Whiteplanes;