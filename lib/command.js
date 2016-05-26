// command.js
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

var commands = {
    push: {
        token: "  ",
        isRequiredParameter: true,
        process: function(context, parameter) {
            var value = parseInt(parameter.value, 2);
            context.stack.push(value);
        }
    },
    copy: {
        token: " \t ",
        isRequiredParameter: true,
        process: function(context, parameter) {
            var value = parseInt(parameter.value, 2);
            context.stack.push(context.stack[value]);
        }
    },
    slide: {
        token: " \t\n",
        isRequiredParameter: true,
        process: function(context, parameter) {
            var value = context.stack.pop();
            var count = parseInt(parameter.value, 2);
            for(var index = 0; index < count; index++){
                context.stack.pop()
            }
            context.stack.push(value)
        }
    },
    duplicate: {
        token: " \n ",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var index = context.stack.length - 1;
            context.stack.push(context.stack[index]);
        }
    },
    swap: {
        token: " \n\t",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var lhs = context.stack.pop()
            var rhs = context.stack.pop()
            context.stack.push(lhs)
            context.stack.push(rhs)
        }
    },
    discard: {
        token: " \n\n",
        isRequiredParameter: false,
        process: function(context, parameter) {
            context.stack.pop()
        }
    },
    add: {
        token: "\t   ",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var lhs = context.stack.pop()
            var rhs = context.stack.pop()
            context.stack.push(lhs + rhs)
        }
    },
    sub: {
        token: "\t  \t",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var lhs = context.stack.pop()
            var rhs = context.stack.pop()
            context.stack.push(lhs - rhs)
        }
    },
    mul: {
        token: "\t  \n",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var lhs = context.stack.pop()
            var rhs = context.stack.pop()
            context.stack.push(lhs * rhs)
        }
    },
    div: {
        token: "\t \t ",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var lhs = context.stack.pop()
            var rhs = context.stack.pop()
            context.stack.push(lhs / rhs)
        }
    },
    mod: {
        token: "\t \t\t",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var lhs = context.stack.pop()
            var rhs = context.stack.pop()
            context.stack.push(lhs % rhs)
        }
    },
    store: {
        token: "\t\t ",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var value   = context.stack.pop()
            var address = context.stack.pop()
            context.heap[address] = value;
        }
    },
    retrieve: {
        token: "\t\t\t",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var value   = context.stack.pop()
            context.stack.push(context.heap[value]);
        }
    },
    register: {
        token: "\n  ",
        isRequiredParameter: true,
        process: function(context, parameter) {
            context.labels[parameter.value] = parameter.location;
        }
    },
    call: {
        token: "\n \t",
        isRequiredParameter: true,
        process: function(context, parameter) {
            context.callstack.push(parameter.location);
            context.counter = context.labels[parameter.value]
        }
    },
    jump: {
        token: "\n \n",
        isRequiredParameter: true,
        process: function(context, parameter) {
            context.counter = context.labels[parameter.value]
        }
    },
    equal: {
        token: "\n\t ",
        isRequiredParameter: true,
        process: function(context, parameter) {
            if (context.stack.pop() == 0) {
                context.counter = context.labels[parameter.value];
            }
        }
    },
    less: {
        token: "\n\t\t",
        isRequiredParameter: true,
        process: function(context, parameter) {
            if (context.stack.pop() < 0) {
                context.counter = context.labels[parameter.value];
            }
        }
    },
    back: {
        token: "\n\t\n",
        isRequiredParameter: false,
        process: function(context, parameter) {
            context.counter = context.callstack.pop()
        }
    },
    end: {
        token: "\n\n\n",
        isRequiredParameter: false,
        process: function(context, parameter) {
            context.counter = Number.MAX_VALUE - 1
        }
    },
    cout: {
        token: "\t\n  ",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var value = context.stack.pop()
            context.output("cout", String.fromCharCode(value))
        }
    },
    iout: {
        token: "\t\n \t",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var value = context.stack.pop()
            context.output("iout", value.valueOf())
        }
    },
    cin: {
        token: "\t\n\t ",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var address = context.stack.pop()
            var value = context.input("cin").charCodeAt(0);
            context.heap[address] = value;
        }
    },
    iin: {
        token: "\t\n\t\t",
        isRequiredParameter: false,
        process: function(context, parameter) {
            var address = context.stack.pop()
            var value = context.input("iin")
            context.heap[address] = value;
        }
    }

}

module.exports = commands;