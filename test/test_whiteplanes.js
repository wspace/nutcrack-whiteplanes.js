// test_whiteplanes.js
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
var fs          = require('fs');
var assert      = require("power-assert");
var Whiteplanes = require("../lib/whiteplanes");

describe('whiteplanes', function(){
    this.context = null
    beforeEach(function() {
        this.context = {
            stack: [],
            heap: {},
            labels: {},
            callstack: [],
            counter: 0
        }
    })

    it("Test 'hello'", function(){
        var source = fs.readFileSync('test/etc/hello_world.ws', 'utf8');
        var interpreter = new Whiteplanes(source);

        var actual = "";
        this.context["output"] = function(command, value){
            actual += value;
        }
        interpreter.execute(this.context);
        assert(actual == "Hello World\n");
    });

    it("Test 'heap'", function(){
        var source = fs.readFileSync('test/etc/heap_control.ws', 'utf8');
        var interpreter = new Whiteplanes(source);

        var actual = "";
        this.context["output"] = function(command, value){
            actual += value;
        }
        interpreter.execute(this.context);
        assert(actual == "Hello World\n");
    });

    it("Test 'flow'", function(){
        var source = fs.readFileSync('test/etc/flow_control.ws', 'utf8');
        var interpreter = new Whiteplanes(source);

        var actual = "";
        this.context["output"] = function(command, value){
            actual += value;
        }
        interpreter.execute(this.context);
        assert(actual == "52");
    });

    it("Test 'heap'", function(){
        var source = fs.readFileSync('test/etc/count.ws', 'utf8');
        var interpreter = new Whiteplanes(source);

        var actual = "";
        this.context["output"] = function(command, value){
            actual += value;
        }
        interpreter.execute(this.context);
        assert(actual == "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n")
    });

    it("Test 'heap'", function(){
        var source = fs.readFileSync('test/etc/input.ws', 'utf8');
        var interpreter = new Whiteplanes(source);

        var actual = "";
        this.context["input"] = function(command){
            return command == "cin" ? "H" : 72;
        }
        this.context["output"] = function(command, value){
            actual += value;
        }
        interpreter.execute(this.context);
        assert(actual == "H72")
    });

});