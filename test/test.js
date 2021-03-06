/*
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2011 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2011 Arpad Borsos <arpad.borsos@googlemail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint browser:true node:true */
/*global esprima:true */

var runTests, data;

data = {

    'Primary Expression': {

        'this\n': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'ThisExpression',
                    range: [0, 3]
                },
                range: [0, 4]
            }],
            range: [0, 4],
            tokens: [{
                type: 'Keyword',
                value: 'this',
                range: [0, 3]
            }]
        },

        '\n    42\n\n': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [5, 8]
            }],
            range: [5, 8],
            tokens: [{
                type: 'Numeric',
                value: '42',
                range: [5, 6]
            }]
        },

        '(1 + 2 ) * 3': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'Literal',
                        value: 1,
                        range: [1, 1]
                    },
                    right: {
                        type: 'Literal',
                        value: 2,
                        range: [5, 5]
                    },
                    range: [0, 7]
                },
                right: {
                    type: 'Literal',
                    value: 3,
                    range: [11, 11]
                },
                range: [0, 11]
            },
            range: [0, 11]
        }
    },

    'Array Initializer': {

        'x = []': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'ArrayExpression',
                        elements: [],
                        range: [4, 5]
                    },
                    range: [0, 5]
                },
                range: [0, 5]
            }],
            range: [0, 5],
            tokens: [{
                type: 'Identifier',
                value: 'x',
                range: [0, 0]
            }, {
                type: 'Punctuator',
                value: '=',
                range: [2, 2]
            }, {
                type: 'Punctuator',
                value: '[',
                range: [4, 4]
            }, {
                type: 'Punctuator',
                value: ']',
                range: [5, 5]
            }]
        },

        'x = [ ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: []
                }
            }
        },

        'x = [ 42 ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 42
                    }]
                }
            }
        },

        'x = [ 42, ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 42,
                        range: [6, 7]
                    }],
                    range: [4, 10]
                },
                range: [0, 10]
            },
            range: [0, 10]
        },

        'x = [ ,, 42 ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [
                        null,
                        null, {
                            type: 'Literal',
                            value: 42
                        }
                    ]
                }
            }
        },

        'x = [ 1, 2, 3, ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 1
                    }, {
                        type: 'Literal',
                        value: 2
                    }, {
                        type: 'Literal',
                        value: 3
                    }]
                }
            }
        },

        'x = [ 1, 2,, 3, ]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: [{
                        type: 'Literal',
                        value: 1
                    }, {
                        type: 'Literal',
                        value: 2
                    }, null, {
                        type: 'Literal',
                        value: 3
                    }]
                }
            }
        },

        '日本語 = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: '日本語'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: []
                }
            }
        },

        'T\u203F = []': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'T\u203F'
                },
                right: {
                    type: 'ArrayExpression',
                    elements: []
                }
            }
        }

    },

    'Object Initializer': {

        'x = {}': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: []
                }
            }
        },

        'x = { }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: []
                }
            }
        },

        'x = { answer: 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'answer'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        'x = { if: 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'if'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        'x = { true: 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'true'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        'x = { false: 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'false'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        'x = { null: 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'null'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        'x = { "answer": 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Literal',
                            value: 'answer'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        'x = { get width() { return m_width } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'width'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ReturnStatement',
                                    argument: {
                                        type: 'Identifier',
                                        name: 'm_width'
                                    }
                                }]
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get undef() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'undef'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get if() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'if'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get true() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'true'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get false() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'false'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get null() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'null'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get "undef"() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Literal',
                            value: 'undef'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { get 10() {} }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Literal',
                            value: 10
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [],
                            body: {
                                type: 'BlockStatement',
                                body: []
                            }
                        },
                        kind: 'get'
                    }]
                }
            }
        },

        'x = { set width(w) { m_width = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'width'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_width'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        'x = { set if(w) { m_if = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'if'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_if'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        'x = { set true(w) { m_true = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'true'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_true'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        'x = { set false(w) { m_false = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'false'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_false'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        'x = { set null(w) { m_null = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'null'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_null'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        'x = { set "null"(w) { m_null = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Literal',
                            value: 'null'
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_null'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        'x = { set 10(w) { m_null = w } }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Literal',
                            value: 10
                        },
                        value: {
                            type: 'FunctionExpression',
                            id: null,
                            params: [{
                                type: 'Identifier',
                                name: 'w'
                            }],
                            body: {
                                type: 'BlockStatement',
                                body: [{
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'AssignmentExpression',
                                        operator: '=',
                                        left: {
                                            type: 'Identifier',
                                            name: 'm_null'
                                        },
                                        right: {
                                            type: 'Identifier',
                                            name: 'w'
                                        }
                                    }
                                }]
                            }
                        },
                        kind: 'set'
                    }]
                }
            }
        },

        // This should not be treated as getter.

        'x = { get: 42 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'get'
                        },
                        value: {
                            type: 'Literal',
                            value: 42
                        }
                    }]
                }
            }
        },

        // This should not be treated as setter.

        'x = { set: 43 }': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [{
                        key: {
                            type: 'Identifier',
                            name: 'set'
                        },
                        value: {
                            type: 'Literal',
                            value: 43
                        }
                    }]
                }
            }
        }
    },

    'Comments': {

        '/* block comment */ 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 42
            }
        },

        '42 /*The*/ /*Answer*/': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 42
                }
            }],
            comments: [{
                range: [3, 9],
                type: 'Block',
                value: 'The'
            }, {
                range: [11, 20],
                type: 'Block',
                value: 'Answer'
            }]
        },

        '/* multiline\ncomment\nshould\nbe\nignored */ 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 42
            }
        },

        '// line comment\n42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 42
            }
        },

        '// Hello, world!\n42': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 42
                }
            }],
            comments: [{
                range: [0, 16],
                type: 'Line',
                value: ' Hello, world!'
            }]
        },

        '// Hello, world!\n\n//   Another hello\n42': {
            type: 'Program',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: 42
                }
            }],
            comments: [{
                range: [0, 16],
                type: 'Line',
                value: ' Hello, world!'
            }, {
                range: [18, 36],
                type: 'Line',
                value: '   Another hello'
            }]
        },

        'if (x) { // Some comment\ndoThat(); }': {
            type: 'Program',
            body: [{
                type: 'IfStatement',
                test: {
                    type: 'Identifier',
                    name: 'x'
                },
                consequent: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'doThat'
                            },
                            'arguments': []
                        }
                    }]
                },
                alternate: null
            }],
            comments: [{
                range: [9, 24],
                type: 'Line',
                value: ' Some comment'
            }]
        },

        'switch (answer) { case 42: /* perfect */ bingo() }': {
            type: 'Program',
            body: [{
                type: 'SwitchStatement',
                discriminant: {
                    type: 'Identifier',
                    name: 'answer'
                },
                cases: [{
                    type: 'SwitchCase',
                    test: {
                        type: 'Literal',
                        value: 42
                    },
                    consequent: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'bingo'
                            },
                            'arguments': []
                        }
                    }]
                }]
            }],
            comments: [{
                range: [27, 39],
                type: 'Block',
                value: ' perfect '
            }]
        }

    },

    'Numeric Literals': {

        '42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 42
            }
        },

        '0': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0
            }
        },

        '.14': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0.14
            }
        },

        '3.14159': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 3.14159
            }
        },

        '6.02214179e+23': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 6.02214179e+23
            }
        },

        '1.492417830e-10': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 1.492417830e-10
            }
        },

        '0x0': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0x0
            }
        },

        '0xabc': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0xabc
            }
        },

        '0xdef': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0xdef
            }
        },

        '0X1A': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0X1A
            }
        },

        '0x10': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0x10
            }
        },

        '0x100': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0x100
            }
        },

        '0X04': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 0X04
            }
        }
    },

    'String Literals': {

        '"Hello"': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 'Hello'
            }
        },

        '"Hello\nworld"': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 'Hello\nworld'
            }
        },


        '"Hello\\\n world"': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Literal',
                value: 'Hello world'
            }
        }

    },

    'Regular Expression Literals': {

        'var x = /[a-z]/i': {
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: '/[a-z]/i',
                        range: [8, 15]
                    }
                }],
                kind: 'var',
                range: [0, 15]
            }],
            range: [0, 15],
            tokens: [{
                type: 'Keyword',
                value: 'var',
                range: [0, 2]
            }, {
                type: 'Identifier',
                value: 'x',
                range: [4, 4]
            }, {
                type: 'Punctuator',
                value: '=',
                range: [6, 6]
            }, {
                type: 'RegularExpression',
                value: '/[a-z]/i',
                range: [8, 15]
            }]
        },

        'var x = /[P QR]/i': {
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: '/[P QR]/i',
                        range: [8, 16]
                    }
                }],
                kind: 'var',
                range: [0, 16]
            }],
            range: [0, 16],
            tokens: [{
                type: 'Keyword',
                value: 'var',
                range: [0, 2]
            }, {
                type: 'Identifier',
                value: 'x',
                range: [4, 4]
            }, {
                type: 'Punctuator',
                value: '=',
                range: [6, 6]
            }, {
                type: 'RegularExpression',
                value: '/[P QR]/i',
                range: [8, 16]
            }]
        },

        'var x = /foo\\/bar/': {
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: '/foo\\/bar/',
                        range: [8, 17]
                    }
                }],
                kind: 'var',
                range: [0, 17]
            }],
            range: [0, 17],
            tokens: [{
                type: 'Keyword',
                value: 'var',
                range: [0, 2]
            }, {
                type: 'Identifier',
                value: 'x',
                range: [4, 4]
            }, {
                type: 'Punctuator',
                value: '=',
                range: [6, 6]
            }, {
                type: 'RegularExpression',
                value: '/foo\\/bar/',
                range: [8, 17]
            }]
        },

        'var x = /=([^=\\s])+/g': {
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: '/=([^=\\s])+/g',
                        range: [8, 20]
                    }
                }],
                kind: 'var',
                range: [0, 20]
            }],
            range: [0, 20],
            tokens: [{
                type: 'Keyword',
                value: 'var',
                range: [0, 2]
            }, {
                type: 'Identifier',
                value: 'x',
                range: [4, 4]
            }, {
                type: 'Punctuator',
                value: '=',
                range: [6, 6]
            }, {
                type: 'RegularExpression',
                value: '/=([^=\\s])+/g',
                range: [8, 20]
            }]
        }
    },

    'Left-Hand-Side Expression': {

        'new Button': {
            type: 'ExpressionStatement',
            expression: {
                type: 'NewExpression',
                callee: {
                    type: 'Identifier',
                    name: 'Button'
                },
                'arguments': []
            }
        },

        'new Button()': {
            type: 'ExpressionStatement',
            expression: {
                type: 'NewExpression',
                callee: {
                    type: 'Identifier',
                    name: 'Button'
                },
                'arguments': []
            }
        },

        'new new foo': {
            type: 'ExpressionStatement',
            expression: {
                type: 'NewExpression',
                callee: {
                    type: 'NewExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'foo'
                    },
                    'arguments': []
                },
                'arguments': []
            }
        },

        'new new foo()': {
            type: 'ExpressionStatement',
            expression: {
                type: 'NewExpression',
                callee: {
                    type: 'NewExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'foo'
                    },
                    'arguments': []
                },
                'arguments': []
            }
        },

        'new foo().bar()': {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'NewExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'foo'
                        },
                        'arguments': []
                    },
                    property: {
                        type: 'Identifier',
                        name: 'bar'
                    }
                },
                'arguments': []
            }
        },

        'new foo.bar()': {
            type: 'ExpressionStatement',
            expression: {
                type: 'NewExpression',
                callee: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'Identifier',
                        name: 'foo'
                    },
                    property: {
                        type: 'Identifier',
                        name: 'bar'
                    }
                },
                'arguments': []
            }
        },


        'foo(bar, baz)': {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: 'foo'
                },
                'arguments': [{
                    type: 'Identifier',
                    name: 'bar'
                }, {
                    type: 'Identifier',
                    name: 'baz'
                }]
            }
        },

        'universe.milkyway': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'Identifier',
                    name: 'milkyway',
                    range: [9, 16]
                },
                range: [0, 16]
            },
            range: [0, 16]
        },

        'universe.milkyway.solarsystem': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'Identifier',
                        name: 'universe',
                        range: [0, 7]
                    },
                    property: {
                        type: 'Identifier',
                        name: 'milkyway',
                        range: [9, 16]
                    },
                    range: [0, 16]
                },
                property: {
                    type: 'Identifier',
                    name: 'solarsystem',
                    range: [18, 28]
                },
                range: [0, 28]
            },
            range: [0, 28]
        },

        'universe.milkyway.solarsystem.Earth': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'MemberExpression',
                        computed: false,
                        object: {
                            type: 'Identifier',
                            name: 'universe',
                            range: [0, 7]
                        },
                        property: {
                            type: 'Identifier',
                            name: 'milkyway',
                            range: [9, 16]
                        },
                        range: [0, 16]
                    },
                    property: {
                        type: 'Identifier',
                        name: 'solarsystem',
                        range: [18, 28]
                    },
                    range: [0, 28]
                },
                property: {
                    type: 'Identifier',
                    name: 'Earth',
                    range: [30, 34]
                },
                range: [0, 34]
            },
            range: [0, 34]
        },

        'universe[galaxyName, otherUselessName]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: true,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'SequenceExpression',
                    expressions: [{
                        type: 'Identifier',
                        name: 'galaxyName',
                        range: [9, 18]
                    }, {
                        type: 'Identifier',
                        name: 'otherUselessName',
                        range: [21, 36]
                    }],
                    range: [9, 36]
                },
                range: [0, 37]
            },
            range: [0, 37]
        },

        'universe[galaxyName]': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: true,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'Identifier',
                    name: 'galaxyName',
                    range: [9, 18]
                },
                range: [0, 19]
            },
            range: [0, 19]
        },

        'universe[42].galaxies': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'MemberExpression',
                    computed: true,
                    object: {
                        type: 'Identifier',
                        name: 'universe',
                        range: [0, 7]
                    },
                    property: {
                        type: 'Literal',
                        value: 42,
                        range: [9, 10]
                    },
                    range: [0, 11]
                },
                property: {
                    type: 'Identifier',
                    name: 'galaxies',
                    range: [13, 20]
                },
                range: [0, 20]
            },
            range: [0, 20]
        },

        'universe(42).galaxies': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'universe'
                    },
                    'arguments': [{
                        type: 'Literal',
                        value: 42
                    }]
                },
                property: {
                    type: 'Identifier',
                    name: 'galaxies'
                }
            }
        },

        'universe(42).galaxies(14, 3, 77).milkyway': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'CallExpression',
                    callee: {
                        type: 'MemberExpression',
                        computed: false,
                        object: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'universe'
                            },
                            'arguments': [{
                                type: 'Literal',
                                value: 42
                            }]
                        },
                        property: {
                            type: 'Identifier',
                            name: 'galaxies'
                        }
                    },
                    'arguments': [{
                        type: 'Literal',
                        value: 14
                    }, {
                        type: 'Literal',
                        value: 3
                    }, {
                        type: 'Literal',
                        value: 77
                    }]
                },
                property: {
                    type: 'Identifier',
                    name: 'milkyway'
                }
            }
        },

        'earth.asia.Indonesia.prepareForElection(2014)': {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                callee: {
                    type: 'MemberExpression',
                    computed: false,
                    object: {
                        type: 'MemberExpression',
                        computed: false,
                        object: {
                            type: 'MemberExpression',
                            computed: false,
                            object: {
                                type: 'Identifier',
                                name: 'earth'
                            },
                            property: {
                                type: 'Identifier',
                                name: 'asia'
                            }
                        },
                        property: {
                            type: 'Identifier',
                            name: 'Indonesia'
                        }
                    },
                    property: {
                        type: 'Identifier',
                        name: 'prepareForElection'
                    }
                },
                'arguments': [{
                    type: 'Literal',
                    value: 2014
                }]
            }
        },

        'universe.if': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'Identifier',
                    name: 'if',
                    range: [9, 10]
                },
                range: [0, 10]
            },
            range: [0, 10]
        },

        'universe.true': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'Identifier',
                    name: 'true',
                    range: [9, 12]
                },
                range: [0, 12]
            },
            range: [0, 12]
        },

        'universe.false': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'Identifier',
                    name: 'false',
                    range: [9, 13]
                },
                range: [0, 13]
            },
            range: [0, 13]
        },

        'universe.null': {
            type: 'ExpressionStatement',
            expression: {
                type: 'MemberExpression',
                computed: false,
                object: {
                    type: 'Identifier',
                    name: 'universe',
                    range: [0, 7]
                },
                property: {
                    type: 'Identifier',
                    name: 'null',
                    range: [9, 12]
                },
                range: [0, 12]
            },
            range: [0, 12]
        }
    },

    'Postfix Expressions': {

        'x++': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UpdateExpression',
                operator: '++',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                prefix: false,
                range: [0, 2]
            },
            range: [0, 2]
        },

        'x--': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UpdateExpression',
                operator: '--',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                prefix: false,
                range: [0, 2]
            },
            range: [0, 2]
        }
    },

    'Unary Operators': {

        '++x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UpdateExpression',
                operator: '++',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [2, 2]
                },
                prefix: true,
                range: [0, 2]
            },
            range: [0, 2]
        },

        '--x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UpdateExpression',
                operator: '--',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [2, 2]
                },
                prefix: true,
                range: [0, 2]
            },
            range: [0, 2]
        },

        '+x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: '+',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [1, 1]
                },
                range: [0, 1]
            },
            range: [0, 1]
        },

        '-x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: '-',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [1, 1]
                },
                range: [0, 1]
            },
            range: [0, 1]
        },

        '~x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: '~',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [1, 1]
                },
                range: [0, 1]
            },
            range: [0, 1]
        },

        '!x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: '!',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [1, 1]
                },
                range: [0, 1]
            },
            range: [0, 1]
        },

        'void x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'delete x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: 'delete',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [7, 7]
                },
                range: [0, 7]
            },
            range: [0, 7]
        },

        'typeof x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'UnaryExpression',
                operator: 'typeof',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [7, 7]
                },
                range: [0, 7]
            },
            range: [0, 7]
        }
    },

    'Multiplicative Operators': {

        'x * y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x / y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '/',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x % y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '%',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        }
    },

    'Additive Operators': {

        'x + y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x - y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        }
    },

    'Bitwise Shift Operator': {

        'x << y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '<<',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x >> y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '>>',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x >>> y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '>>>',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [6, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        }
    },

    'Relational Operators': {

        'x < y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x > y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '>',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x <= y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '<=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x >= y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '>=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x in y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: 'in',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x instanceof y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: 'instanceof',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [13, 13]
                },
                range: [0, 13]
            },
            range: [0, 13]
        }
    },

    'Equality Operators': {

        'x == y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '==',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x != y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '!=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x === y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '===',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [6, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x !== y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '!==',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [6, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        }
    },

    'Binary Bitwise Operators' : {

        'x & y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '&',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x ^ y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '^',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        },

        'x | y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '|',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [4, 4]
                },
                range: [0, 4]
            },
            range: [0, 4]
        }
    },

    'Binary Expressions': {

        'x + y + z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x - y + z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'BinaryExpression',
                    operator: '-',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x + y - z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x - y - z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                    type: 'BinaryExpression',
                    operator: '-',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x + y * z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'z',
                        range: [8, 8]
                    },
                    range: [4, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x + y / z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '+',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'BinaryExpression',
                    operator: '/',
                    left: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'z',
                        range: [8, 8]
                    },
                    range: [4, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x - y % z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '-',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'BinaryExpression',
                    operator: '%',
                    left: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'z',
                        range: [8, 8]
                    },
                    range: [4, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x * y * z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x * y / z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '/',
                left: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x * y % z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '%',
                left: {
                    type: 'BinaryExpression',
                    operator: '*',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x % y * z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'BinaryExpression',
                    operator: '%',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x << y << z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '<<',
                left: {
                    type: 'BinaryExpression',
                    operator: '<<',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [5, 5]
                    },
                    range: [0, 5]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [10, 10]
                },
                range: [0, 10]
            },
            range: [0, 10]
        },

        'x | y | z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '|',
                left: {
                    type: 'BinaryExpression',
                    operator: '|',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x & y & z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '&',
                left: {
                    type: 'BinaryExpression',
                    operator: '&',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x ^ y ^ z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '^',
                left: {
                    type: 'BinaryExpression',
                    operator: '^',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x & y | z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '|',
                left: {
                    type: 'BinaryExpression',
                    operator: '&',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x | y ^ z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '^',
                left: {
                    type: 'BinaryExpression',
                    operator: '|',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    range: [0, 4]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x | y & z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'BinaryExpression',
                operator: '|',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'BinaryExpression',
                    operator: '&',
                    left: {
                        type: 'Identifier',
                        name: 'y',
                        range: [4, 4]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'z',
                        range: [8, 8]
                    },
                    range: [4, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        }
    },

    'Binary Logical Operators': {

        'x || y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'LogicalExpression',
                operator: '||',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x && y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'LogicalExpression',
                operator: '&&',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [5, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x || y || z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'LogicalExpression',
                operator: '||',
                left: {
                    type: 'LogicalExpression',
                    operator: '||',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [5, 5]
                    },
                    range: [0, 5]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [10, 10]
                },
                range: [0, 10]
            },
            range: [0, 10]
        },

        'x && y && z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'LogicalExpression',
                operator: '&&',
                left: {
                    type: 'LogicalExpression',
                    operator: '&&',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [5, 5]
                    },
                    range: [0, 5]
                },
                right: {
                    type: 'Identifier',
                    name: 'z',
                    range: [10, 10]
                },
                range: [0, 10]
            },
            range: [0, 10]
        },

        'x || y && z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'LogicalExpression',
                operator: '||',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'LogicalExpression',
                    operator: '&&',
                    left: {
                        type: 'Identifier',
                        name: 'y',
                        range: [5, 5]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'z',
                        range: [10, 10]
                    },
                    range: [5, 10]
                },
                range: [0, 10]
            },
            range: [0, 10]
        },

        'x || y ^ z': {
            type: 'ExpressionStatement',
            expression: {
                type: 'LogicalExpression',
                operator: '||',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'BinaryExpression',
                    operator: '^',
                    left: {
                        type: 'Identifier',
                        name: 'y',
                        range: [5, 5]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'z',
                        range: [9, 9]
                    },
                    range: [5, 9]
                },
                range: [0, 9]
            },
            range: [0, 9]
        }
    },

    'Conditional Operator': {

        'y ? 1 : 2': {
            type: 'ExpressionStatement',
            expression: {
                type: 'ConditionalExpression',
                test: {
                    type: 'Identifier',
                    name: 'y',
                    range: [0, 0]
                },
                consequent: {
                    type: 'Literal',
                    value: 1,
                    range: [4, 4]
                },
                alternate: {
                    type: 'Literal',
                    value: 2,
                    range: [8, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x && y ? 1 : 2': {
            type: 'ExpressionStatement',
            expression: {
                type: 'ConditionalExpression',
                test: {
                    type: 'LogicalExpression',
                    operator: '&&',
                    left: {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'y',
                        range: [5, 5]
                    },
                    range: [0, 5]
                },
                consequent: {
                    type: 'Literal',
                    value: 1,
                    range: [9, 9]
                },
                alternate: {
                    type: 'Literal',
                    value: 2,
                    range: [13, 13]
                },
                range: [0, 13]
            },
            range: [0, 13]
        }
    },

    'Assignment Operators': {

        'x = 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [4, 5]
                },
                range: [0, 5]
            },
            range: [0, 5]
        },

        'x *= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '*=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x /= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '/=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x %= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '%=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x += 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '+=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x -= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '-=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x <<= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '<<=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [6, 7]
                },
                range: [0, 7]
            },
            range: [0, 7]
        },

        'x >>= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '>>=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [6, 7]
                },
                range: [0, 7]
            },
            range: [0, 7]
        },

        'x >>>= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '>>>=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [7, 8]
                },
                range: [0, 8]
            },
            range: [0, 8]
        },

        'x &= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '&=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x ^= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '^=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        },

        'x |= 42': {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '|=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [0, 0]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [5, 6]
                },
                range: [0, 6]
            },
            range: [0, 6]
        }
    },

    'Block': {

        '{ foo }': {
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'foo'
                }
            }]
        },

        '{ doThis(); doThat(); }': {
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'doThis'
                    },
                    'arguments': []
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'doThat'
                    },
                    'arguments': []
                }
            }]
        },

        '{}': {
            type: 'BlockStatement',
            body: []
        }
    },

    'Variable Statement': {

        'var x': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x'
                },
                init: null
            }],
            kind: 'var'
        },

        'var x, y;': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x'
                },
                init: null
            }, {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'y'
                },
                init: null
            }],
            kind: 'var'
        },

        'var x = 42': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x'
                },
                init: {
                    type: 'Literal',
                    value: 42
                }
            }],
            kind: 'var'
        },

        'var x = 14, y = 3, z = 1977': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x'
                },
                init: {
                    type: 'Literal',
                    value: 14
                }
            }, {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'y'
                },
                init: {
                    type: 'Literal',
                    value: 3
                }
            }, {
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'z'
                },
                init: {
                    type: 'Literal',
                    value: 1977
                }
            }],
            kind: 'var'
        }

    },

    'Let Statement': {

        'let x': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x'
                },
                init: null
            }],
            kind: 'let'
        },

        '{ let x }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: null
                }],
                kind: 'let'
            }]
        },

        '{ let x = 42 }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 42
                    }
                }],
                kind: 'let'
            }]
        },

        '{ let x = 14, y = 3, z = 1977 }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 14
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'y'
                    },
                    init: {
                        type: 'Literal',
                        value: 3
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'z'
                    },
                    init: {
                        type: 'Literal',
                        value: 1977
                    }
                }],
                kind: 'let'
            }]
        }
    },

    'Const Statement': {

        'const x = 42': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'x'
                },
                init: {
                    type: 'Literal',
                    value: 42
                }
            }],
            kind: 'const'
        },

        '{ const x = 42 }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 42
                    }
                }],
                kind: 'const'
            }]
        },

        '{ const x = 14, y = 3, z = 1977 }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 14
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'y'
                    },
                    init: {
                        type: 'Literal',
                        value: 3
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'z'
                    },
                    init: {
                        type: 'Literal',
                        value: 1977
                    }
                }],
                kind: 'const'
            }]
        }
    },

    'Empty Statement': {

        ';': {
            type: 'EmptyStatement'
        }

    },

    'Expression Statement': {

        'x': {
            type: 'ExpressionStatement',
            expression: {
                type: 'Identifier',
                name: 'x'
            }
        },

        'x, y': {
            type: 'ExpressionStatement',
            expression: {
                type: 'SequenceExpression',
                expressions: [
                    {
                        type: 'Identifier',
                        name: 'x',
                        range: [0, 0]
                    },
                    {
                        type: 'Identifier',
                        name: 'y',
                        range: [3, 3]
                    }
                ],
                range: [0, 3]
            },
            range: [0, 3]
        }

    },

    'If Statement': {

        'if (morning) goodMorning()': {
            type: 'IfStatement',
            test: {
                type: 'Identifier',
                name: 'morning'
            },
            consequent: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'goodMorning'
                    },
                    'arguments': []
                }
            },
            alternate: null
        },

        'if (morning) (function(){})': {
            type: 'IfStatement',
            test: {
                type: 'Identifier',
                name: 'morning'
            },
            consequent: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                        type: 'BlockStatement',
                        body: []
                    }
                }
            },
            alternate: null
        },

        'if (morning) var x = 0;': {
            type: 'IfStatement',
            test: {
                type: 'Identifier',
                name: 'morning'
            },
            consequent: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 0
                    }
                }],
                kind: 'var'
            },
            alternate: null
        },

        'if (morning) function a(){}': {
            type: 'IfStatement',
            test: {
                type: 'Identifier',
                name: 'morning'
            },
            consequent: {
                type: 'FunctionDeclaration',
                id: {
                    type: 'Identifier',
                    name: 'a'
                },
                params: [],
                body: {
                    type: 'BlockStatement',
                    body: []
                }
            },
            alternate: null
        },

        'if (morning) goodMorning(); else goodDay()': {
            type: 'IfStatement',
            test: {
                type: 'Identifier',
                name: 'morning'
            },
            consequent: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'goodMorning'
                    },
                    'arguments': []
                }
            },
            alternate: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'goodDay'
                    },
                    'arguments': []
                }
            }
        }

    },

    'Iteration Statements': {

        'do keep(); while (true)': {
            type: 'DoWhileStatement',
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'keep'
                    },
                    'arguments': []
                }
            },
            test: {
                type: 'Literal',
                value: true
            }
        },

        'do { x++; y--; } while (x < 10)': {
            type: 'DoWhileStatement',
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'UpdateExpression',
                        operator: '++',
                        argument: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        prefix: false
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'UpdateExpression',
                        operator: '--',
                        argument: {
                            type: 'Identifier',
                            name: 'y'
                        },
                        prefix: false
                    }
                }]
            },
            test: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'Literal',
                    value: 10
                }
            }
        },

        '{ do { } while (false) false }': {
            type: 'BlockStatement',
            body: [{
                type: 'DoWhileStatement',
                body: {
                    type: 'BlockStatement',
                    body: []
                },
                test: {
                    type: 'Literal',
                    value: false
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Literal',
                    value: false
                }
            }]
        },

        'while (true) doSomething()': {
            type: 'WhileStatement',
            test: {
                type: 'Literal',
                value: true
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'doSomething'
                    },
                    'arguments': []
                }
            }
        },

        'while (x < 10) { x++; y--; }': {
            type: 'WhileStatement',
            test: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'Literal',
                    value: 10
                }
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'UpdateExpression',
                        operator: '++',
                        argument: {
                            type: 'Identifier',
                            name: 'x'
                        },
                        prefix: false
                    }
                }, {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'UpdateExpression',
                        operator: '--',
                        argument: {
                            type: 'Identifier',
                            name: 'y'
                        },
                        prefix: false
                    }
                }]
            }
        },

        'for(;;);': {
            type: 'ForStatement',
            init: null,
            test: null,
            update: null,
            body: {
                type: 'EmptyStatement'
            }
        },

        'for(;;){}': {
            type: 'ForStatement',
            init: null,
            test: null,
            update: null,
            body: {
                type: 'BlockStatement',
                body: []
            }
        },

        'for(x = 0;;);': {
            type: 'ForStatement',
            init: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'Literal',
                    value: 0
                }
            },
            test: null,
            update: null,
            body: {
                type: 'EmptyStatement'
            }
        },

        'for(var x = 0;;);': {
            type: 'ForStatement',
            init: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 0
                    }
                }],
                kind: 'var'
            },
            test: null,
            update: null,
            body: {
                type: 'EmptyStatement'
            }
        },

        'for(let x = 0;;);': {
            type: 'ForStatement',
            init: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 0
                    }
                }],
                kind: 'let'
            },
            test: null,
            update: null,
            body: {
                type: 'EmptyStatement'
            }
        },

        'for(var x = 0, y = 1;;);': {
            type: 'ForStatement',
            init: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 0
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'y'
                    },
                    init: {
                        type: 'Literal',
                        value: 1
                    }
                }],
                kind: 'var'
            },
            test: null,
            update: null,
            body: {
                type: 'EmptyStatement'
            }
        },

        'for(x = 0; x < 42;);': {
            type: 'ForStatement',
            init: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'Literal',
                    value: 0
                }
            },
            test: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                    type: 'Identifier',
                    name: 'x'
                },
                right: {
                    type: 'Literal',
                    value: 42
                }
            },
            update: null,
            body: {
                type: 'EmptyStatement'
            }
        },

        'for(x = 0; x < 42; x++);': {
            type: 'ForStatement',
            init: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [4, 4]
                },
                right: {
                    type: 'Literal',
                    value: 0,
                    range: [8, 8]
                },
                range: [4, 8]
            },
            test: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [11, 11]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [15, 16]
                },
                range: [11, 16]
            },
            update: {
                type: 'UpdateExpression',
                operator: '++',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [19, 19]
                },
                prefix: false,
                range: [19, 21]
            },
            body: {
                type: 'EmptyStatement',
                range: [23, 23]
            },
            range: [0, 23]
        },

        'for(x = 0; x < 42; x++) process(x);': {
            type: 'ForStatement',
            init: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [4, 4]
                },
                right: {
                    type: 'Literal',
                    value: 0,
                    range: [8, 8]
                },
                range: [4, 8]
            },
            test: {
                type: 'BinaryExpression',
                operator: '<',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [11, 11]
                },
                right: {
                    type: 'Literal',
                    value: 42,
                    range: [15, 16]
                },
                range: [11, 16]
            },
            update: {
                type: 'UpdateExpression',
                operator: '++',
                argument: {
                    type: 'Identifier',
                    name: 'x',
                    range: [19, 19]
                },
                prefix: false,
                range: [19, 21]
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process',
                        range: [24, 30]
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x',
                        range: [32, 32]
                    }],
                    range: [24, 33]
                },
                range: [24, 34]
            },
            range: [0, 34]
        },

        'for(x in list) process(x);': {
            type: 'ForInStatement',
            left: {
                type: 'Identifier',
                name: 'x'
            },
            right: {
                type: 'Identifier',
                name: 'list'
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process'
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x'
                    }]
                }
            },
            each: false
        },

        'for (var x in list) process(x);': {
            type: 'ForInStatement',
            left: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: null
                }],
                kind: 'var'
            },
            right: {
                type: 'Identifier',
                name: 'list'
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process'
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x'
                    }]
                }
            },
            each: false
        },

        'for (var x = 42 in list) process(x);': {
            type: 'ForInStatement',
            left: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 42
                    }
                }],
                kind: 'var'
            },
            right: {
                type: 'Identifier',
                name: 'list'
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process'
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x'
                    }]
                }
            },
            each: false
        },

        'for (let x in list) process(x);': {
            type: 'ForInStatement',
            left: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: null
                }],
                kind: 'let'
            },
            right: {
                type: 'Identifier',
                name: 'list'
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process'
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x'
                    }]
                }
            },
            each: false
        },

        'for (let x = 42 in list) process(x);': {
            type: 'ForInStatement',
            left: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 42
                    }
                }],
                kind: 'let'
            },
            right: {
                type: 'Identifier',
                name: 'list'
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process'
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x'
                    }]
                }
            },
            each: false
        },

        'for (var i = function() { return 10 in [] } in list) process(x);': {
            type: 'ForInStatement',
            left: {
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'i'
                    },
                    init: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                            type: 'BlockStatement',
                            body: [{
                                type: 'ReturnStatement',
                                'argument': {
                                    type: 'BinaryExpression',
                                    operator: 'in',
                                    left: {
                                        type: 'Literal',
                                        value: 10
                                    },
                                    right: {
                                        type: 'ArrayExpression',
                                        elements: []
                                    }
                                }
                            }]
                        }
                    }
                }],
                kind: 'var'
            },
            right: {
                type: 'Identifier',
                name: 'list'
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'Identifier',
                        name: 'process'
                    },
                    'arguments': [{
                        type: 'Identifier',
                        name: 'x'
                    }]
                }
            },
            each: false
        }
    },

    'continue statement': {

        'continue': {
            type: 'ContinueStatement',
            label: null
        },

        'continue done': {
            type: 'ContinueStatement',
            label: {
                type: 'Identifier',
                name: 'done'
            }
        },

        'continue done;': {
            type: 'ContinueStatement',
            label: {
                type: 'Identifier',
                name: 'done'
            }
        }

    },

    'break statement': {

        'break': {
            type: 'BreakStatement',
            label: null
        },

        'break done': {
            type: 'BreakStatement',
            label: {
                type: 'Identifier',
                name: 'done'
            }
        },

        'break done;': {
            type: 'BreakStatement',
            label: {
                type: 'Identifier',
                name: 'done'
            }
        }

    },

    'return statement': {

        'return': {
            type: 'ReturnStatement',
            argument: null
        },

        'return;': {
            type: 'ReturnStatement',
            argument: null
        },

        'return x;': {
            type: 'ReturnStatement',
            argument: {
                type: 'Identifier',
                name: 'x'
            }
        },

        'return x * y': {
            type: 'ReturnStatement',
            argument: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [7, 7]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [11, 11]
                },
                range: [7, 11]
            },
            range: [0, 11]
        }

    },

    'with statement': {

        'with (x) foo = bar': {
            type: 'WithStatement',
            object: {
                type: 'Identifier',
                name: 'x',
                range: [6, 6]
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'foo',
                        range: [9, 11]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'bar',
                        range: [15, 17]
                    },
                    range: [9, 17]
                },
                range: [9, 17]
            },
            range: [0, 17]
        },

        'with (x) foo = bar;': {
            type: 'WithStatement',
            object: {
                type: 'Identifier',
                name: 'x',
                range: [6, 6]
            },
            body: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'Identifier',
                        name: 'foo',
                        range: [9, 11]
                    },
                    right: {
                        type: 'Identifier',
                        name: 'bar',
                        range: [15, 17]
                    },
                    range: [9, 17]
                },
                range: [9, 18]
            },
            range: [0, 18]
        },

        'with (x) { foo = bar }': {
            type: 'WithStatement',
            object: {
                type: 'Identifier',
                name: 'x',
                range: [6, 6]
            },
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'Identifier',
                            name: 'foo',
                            range: [11, 13]
                        },
                        right: {
                            type: 'Identifier',
                            name: 'bar',
                            range: [17, 19]
                        },
                        range: [11, 19]
                    },
                    range: [11, 20]
                }],
                range: [9, 21]
            },
            range: [0, 21]
        }

    },

    'switch statement': {

        'switch (x) {}': {
            type: 'SwitchStatement',
            discriminant: {
                type: 'Identifier',
                name: 'x'
            }
        },

        'switch (answer) { case 42: hi(); break; }': {
            type: 'SwitchStatement',
            discriminant: {
                type: 'Identifier',
                name: 'answer'
            },
            cases: [{
                type: 'SwitchCase',
                test: {
                    type: 'Literal',
                    value: 42
                },
                consequent: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'hi'
                        },
                        'arguments': []
                    }
                }, {
                    type: 'BreakStatement',
                    label: null
                }]
            }]
        },

        'switch (answer) { case 42: hi(); break; default: break }': {
            type: 'SwitchStatement',
            discriminant: {
                type: 'Identifier',
                name: 'answer'
            },
            cases: [{
                type: 'SwitchCase',
                test: {
                    type: 'Literal',
                    value: 42
                },
                consequent: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'hi'
                        },
                        'arguments': []
                    }
                }, {
                    type: 'BreakStatement',
                    label: null
                }]
            }, {
                type: 'SwitchCase',
                test: null,
                consequent: [{
                    type: 'BreakStatement',
                    label: null
                }]
            }]
        }

    },

    'Labelled Statements': {

        'start: for (;;) break start': {
            type: 'LabeledStatement',
            label: {
                type: 'Identifier',
                name: 'start'
            },
            body: {
                type: 'ForStatement',
                init: null,
                test: null,
                update: null,
                body: {
                    type: 'BreakStatement',
                    label: {
                        type: 'Identifier',
                        name: 'start'
                    }
                }
            }
        },

        'start: while (true) break start': {
            type: 'LabeledStatement',
            label: {
                type: 'Identifier',
                name: 'start'
            },
            body: {
                type: 'WhileStatement',
                test: {
                    type: 'Literal',
                    value: true
                },
                body: {
                    type: 'BreakStatement',
                    label: {
                        type: 'Identifier',
                        name: 'start'
                    }
                }
            }
        }

    },

    'throw statement': {

        'throw x;': {
            type: 'ThrowStatement',
            argument: {
                type: 'Identifier',
                name: 'x'
            }
        },

        'throw x * y': {
            type: 'ThrowStatement',
            argument: {
                type: 'BinaryExpression',
                operator: '*',
                left: {
                    type: 'Identifier',
                    name: 'x',
                    range: [6, 6]
                },
                right: {
                    type: 'Identifier',
                    name: 'y',
                    range: [10, 10]
                },
                range: [6, 10]
            },
            range: [0, 10]
        },

        'throw { message: "Error" }': {
            type: 'ThrowStatement',
            argument: {
                type: 'ObjectExpression',
                properties: [{
                    key: {
                        type: 'Identifier',
                        name: 'message'
                    },
                    value: {
                        type: 'Literal',
                        value: 'Error'
                    }
                }]
            }
        }

    },

    'try statement': {

        'try { } catch (e) { }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: []
            },
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e'
                },
                guard: null,
                body: {
                    type: 'BlockStatement',
                    body: []
                }
            }],
            finalizer: null
        },

        'try { } catch (e) { say(e) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: []
            },
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e'
                },
                guard: null,
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'say'
                            },
                            'arguments': [{
                                type: 'Identifier',
                                name: 'e'
                            }]
                        }
                    }]
                }
            }],
            finalizer: null
        },

        'try { } finally { cleanup(stuff) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: []
            },
            handlers: [],
            finalizer: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'cleanup'
                        },
                        'arguments': [{
                            type: 'Identifier',
                            name: 'stuff'
                        }]
                    }
                }]
            }
        },

        'try { doThat(); } catch (e) { say(e) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'doThat'
                        },
                        'arguments': []
                    }
                }]
            },
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e'
                },
                guard: null,
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'say'
                            },
                            'arguments': [{
                                type: 'Identifier',
                                name: 'e'
                            }]
                        }
                    }]
                }
            }],
            finalizer: null
        },

        'try { doThat(); } catch (e) { say(e) } finally { cleanup(stuff) }': {
            type: 'TryStatement',
            block: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'doThat'
                        },
                        'arguments': []
                    }
                }]
            },
            handlers: [{
                type: 'CatchClause',
                param: {
                    type: 'Identifier',
                    name: 'e'
                },
                guard: null,
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: {
                                type: 'Identifier',
                                name: 'say'
                            },
                            'arguments': [{
                                type: 'Identifier',
                                name: 'e'
                            }]
                        }
                    }]
                }
            }],
            finalizer: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'cleanup'
                        },
                        'arguments': [{
                            type: 'Identifier',
                            name: 'stuff'
                        }]
                    }
                }]
            }

        }

    },

    'debugger statement': {

        'debugger;': {
            type: 'DebuggerStatement'
        }

    },

    'Function Definition': {

        'function hello() { sayHi(); }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'hello'
            },
            params: [],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sayHi',
                            range: [19, 23]
                        },
                        'arguments': [],
                        range: [19, 25]
                    },
                    range: [19, 26]
                }],
                range: [17, 28]
            },
            range: [0, 28]
        },

        'function hello(a) { sayHi(); }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'hello'
            },
            params: [{
                type: 'Identifier',
                name: 'a'
            }],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sayHi'
                        },
                        'arguments': []
                    }
                }]
            }
        },

        'function hello(a, b) { sayHi(); }': {
            type: 'FunctionDeclaration',
            id: {
                type: 'Identifier',
                name: 'hello'
            },
            params: [{
                type: 'Identifier',
                name: 'a'
            }, {
                type: 'Identifier',
                name: 'b'
            }],
            body: {
                type: 'BlockStatement',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'sayHi'
                        },
                        'arguments': []
                    }
                }]
            }
        },

        'var hi = function() { sayHi() };': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'hi'
                },
                init: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'sayHi'
                                },
                                'arguments': []
                            }
                        }]
                    }
                }
            }],
            kind: 'var'
        },

        'var hello = function hi() { sayHi() };': {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'hello'
                },
                init: {
                    type: 'FunctionExpression',
                    id: {
                        type: 'Identifier',
                        name: 'hi'
                    },
                    params: [],
                    body: {
                        type: 'BlockStatement',
                        body: [{
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'sayHi'
                                },
                                'arguments': []
                            }
                        }]
                    }
                }
            }],
            kind: 'var'
        },

        '(function(){})': {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                id: null,
                params: [],
                body: {
                    type: 'BlockStatement',
                    body: [],
                    range: [11, 12]
                },
                range: [0, 13]
            },
            range: [0, 13]
        }
    },

    'Automatic semicolon insertion': {

        '{ x\n++y }': {
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x'
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: {
                        type: 'Identifier',
                        name: 'y'
                    },
                    prefix: true
                }
            }]
        },

        '{ x\n--y }': {
            type: 'BlockStatement',
            body: [{
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x'
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    argument: {
                        type: 'Identifier',
                        name: 'y'
                    },
                    prefix: true
                }
            }]
        },

        '{ var x = 14, y = 3\nz; }': {
            type: 'BlockStatement',
            body: [{
                type: 'VariableDeclaration',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'x'
                    },
                    init: {
                        type: 'Literal',
                        value: 14
                    }
                }, {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: 'y'
                    },
                    init: {
                        type: 'Literal',
                        value: 3
                    }
                }],
                kind: 'var'
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'z'
                }
            }]
        },

        '{ continue\nthere; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ContinueStatement',
                label: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'there'
                }
            }]
        },

        '{ continue // Comment\nthere; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ContinueStatement',
                label: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'there'
                }
            }]
        },

        '{ continue /* Multiline\nComment */there; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ContinueStatement',
                label: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'there'
                }
            }]
        },

        '{ break\nthere; }': {
            type: 'BlockStatement',
            body: [{
                type: 'BreakStatement',
                label: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'there'
                }
            }]
        },

        '{ break // Comment\nthere; }': {
            type: 'BlockStatement',
            body: [{
                type: 'BreakStatement',
                label: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'there'
                }
            }]
        },

        '{ break /* Multiline\nComment */there; }': {
            type: 'BlockStatement',
            body: [{
                type: 'BreakStatement',
                label: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'there'
                }
            }]
        },

        '{ return\nx; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ReturnStatement',
                argument: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x'
                }
            }]
        },

        '{ return // Comment\nx; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ReturnStatement',
                argument: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x'
                }
            }]
        },

        '{ return/* Multiline\nComment */x; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ReturnStatement',
                argument: null
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'x'
                }
            }]
        },

        '{ throw error\nerror; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ThrowStatement',
                argument: {
                    type: 'Identifier',
                    name: 'error'
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'error'
                }
            }]
        },

        '{ throw error// Comment\nerror; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ThrowStatement',
                argument: {
                    type: 'Identifier',
                    name: 'error'
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'error'
                }
            }]
        },

        '{ throw error/* Multiline\nComment */error; }': {
            type: 'BlockStatement',
            body: [{
                type: 'ThrowStatement',
                argument: {
                    type: 'Identifier',
                    name: 'error'
                }
            }, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'Identifier',
                    name: 'error'
                }
            }]
        }

    },

    'Trace Function Entrance': {

        'function hello() {}': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'EnterFunction'
            }],
            result: 'function hello() {\nEnterFunction(\'hello\', [0, 18]);}'
        },

        'hello = function() {}': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'Enter'
            }],
            result: 'hello = function() {\nEnter(\'hello\', [8, 20]);}'
        },

        'var hello = function() {}': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'TRACE'
            }],
            result: 'var hello = function() {\nTRACE(\'hello\', [12, 24]);}'
        },

        'var hello = function say() {}': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'TRACE'
            }],
            result: 'var hello = function say() {\nTRACE(\'hello\', [12, 28]);}'
        },

        'hello = function () {}': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'EnterFunction'
            }],
            result: 'hello = function () {\nEnterFunction(\'hello\', [8, 21]);}'
        },

        '\n\nfunction say(name) { print(name);}': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'EnterFunction'
            }],
            result: '\n\nfunction say(name) {\nEnterFunction(\'say\', [2, 35]); print(name);}'
        },

        '(function(){}())': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'EnterFunction'
            }],
            result: '(function(){\nEnterFunction(\'[Anonymous]\', [1, 12]);}())'
        },

        '(function(){})()': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'EnterFunction'
            }],
            result: '(function(){\nEnterFunction(\'[Anonymous]\', [0, 13]);})()'
        },

        '[14, 3].forEach(function(x) { alert(x) })': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'TR'
            }],
            result: '[14, 3].forEach(function(x) {\nTR(\'[Anonymous]\', [16, 39]); alert(x) })'
        },

        'var x = { y: function(z) {} }': {
            modifiers: [{
                name: 'Tracer.FunctionEntrance',
                config: 'TR'
            }],
            result: 'var x = { y: function(z) {\nTR(\'y\', [13, 26]);} }'
        }
    },

    'Invalid syntax': {

        '{': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '}': {
            index: 0,
            lineNumber: 1,
            column: 1,
            message: 'Error: Line 1: Unexpected token }'
        },

        '3ea': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '3in[]': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        '0x3in[]': {
            index: 3,
            lineNumber: 1,
            column: 4,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'var x = /(s/g': {
            index: 13,
            lineNumber: 1,
            column: 14,
            message: 'Error: Line 1: Invalid regular expression'
        },

        '/': {
            index: 1,
            lineNumber: 1,
            column: 2,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        'var x = /\n/': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Invalid regular expression: missing /'
        },

        'var x = "\n': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'var if = 42': {
            index: 4,
            lineNumber: 1,
            column: 5,
            message: 'Error: Line 1: Unexpected token if'
        },

        '1 + (': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected end of input'
        },

        '\n\n\n{': {
            index: 4,
            lineNumber: 4,
            column: 2,
            message: 'Error: Line 4: Unexpected end of input'
        },

        '\n/* Some multiline\ncomment */\n)': {
            index: 30,
            lineNumber: 4,
            column: 1,
            message: 'Error: Line 4: Unexpected token )'
        },

        '{ set 1 }': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected number'
        },

        '{ get 2 }': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected number'
        },

        '({ set: s(if) { } })': {
            index: 10,
            lineNumber: 1,
            column: 11,
            message: 'Error: Line 1: Unexpected token if'
        },

        '({ set: s() { } })': {
            index: 12,
            lineNumber: 1,
            column: 13,
            message: 'Error: Line 1: Unexpected token {'
        },

        '({ set: s(a, b) { } })': {
            index: 16,
            lineNumber: 1,
            column: 17,
            message: 'Error: Line 1: Unexpected token {'
        },

        '({ get: g(d) { } })': {
            index: 13,
            lineNumber: 1,
            column: 14,
            message: 'Error: Line 1: Unexpected token {'
        },

        'function t(if) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token if'
        },

        'function t(true) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token true'
        },

        'function t(false) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token false'
        },

        'function t(null) { }': {
            index: 11,
            lineNumber: 1,
            column: 12,
            message: 'Error: Line 1: Unexpected token null'
        },

        'function null() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token null'
        },

        'function true() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token true'
        },

        'function false() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token false'
        },

        'function if() { }': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token if'
        },

        'a b;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected identifier'
        },

        'if.a;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token .'
        },

        'a if;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected token if'
        },

        'a class;': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Unexpected reserved word'
        },

        'break 1;': {
            index: 6,
            lineNumber: 1,
            column: 7,
            message: 'Error: Line 1: Unexpected number'
        },

        'continue 2;': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected number'
        },

        'throw': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected end of input'
        },

        'throw;': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Unexpected token ;'
        },

        'throw\n': {
            index: 5,
            lineNumber: 1,
            column: 6,
            message: 'Error: Line 1: Illegal newline after throw'
        },

        '10 = 20': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Invalid left-hand side in assignment'
        },

        '10++': {
            index: 2,
            lineNumber: 1,
            column: 3,
            message: 'Error: Line 1: Invalid left-hand side expression in postfix operation'
        },

        '++10': {
            index: 4,
            lineNumber: 1,
            column: 5,
            message: 'Error: Line 1: Invalid left-hand side expression in prefix operation'
        },

        'for (10 in []);': {
            index: 13,
            lineNumber: 1,
            column: 14,
            message: 'Error: Line 1: Invalid left-hand side in for-in'
        },

        'for (var i, i2 in {});': {
            index: 15,
            lineNumber: 1,
            column: 16,
            message: 'Error: Line 1: Unexpected token in'
        },

        'for ((i in {}));': {
            index: 14,
            lineNumber: 1,
            column: 15,
            message: 'Error: Line 1: Unexpected token )'
        },

        'try { }': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Missing catch or finally after try'
        },

        '\u203F = 10': {
            index: 0,
            lineNumber: 1,
            column: 1,
            message: 'Error: Line 1: Unexpected token ILLEGAL'
        },

        'const x = 12, y;': {
            index: 15,
            lineNumber: 1,
            column: 16,
            message: 'Error: Line 1: Unexpected token ;'
        },

        'const x, y = 12;': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ,'
        },

        'const x;': {
            index: 7,
            lineNumber: 1,
            column: 8,
            message: 'Error: Line 1: Unexpected token ;'
        },

        'if(true) let a = 1;': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token let'
        },

        'if(true) const a = 1;': {
            index: 9,
            lineNumber: 1,
            column: 10,
            message: 'Error: Line 1: Unexpected token const'
        },

        '\n]': {
            index: 1,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '\r]': {
            index: 1,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '\r\n]': {
            index: 2,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '\n\r]': {
            index: 2,
            lineNumber: 3,
            column: 1,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '//\r\n]': {
            index: 4,
            lineNumber: 2,
            column: 1,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '//\n\r]': {
            index: 4,
            lineNumber: 3,
            column: 1,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '//\r \n]': {
            index: 5,
            lineNumber: 3,
            column: 1,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '/*\r\n*/]': {
            index: 6,
            lineNumber: 2,
            column: 3,
            message: 'Error: Line 2: Unexpected token ]'
        },

        '/*\n\r*/]': {
            index: 6,
            lineNumber: 3,
            column: 3,
            message: 'Error: Line 3: Unexpected token ]'
        },

        '/*\r \n*/]': {
            index: 7,
            lineNumber: 3,
            column: 3,
            message: 'Error: Line 3: Unexpected token ]'
        }
    }
};


function hasComment(syntax) {
    'use strict';
    return typeof syntax.comments !== 'undefined';
}

function hasRange(syntax) {
    'use strict';
    var result = false;
    JSON.stringify(syntax, function (key, value) {
        if (key === 'range') {
            result = true;
        }
        return value;
    });
    return result;
}

function hasTokens(syntax) {
    'use strict';
    var result = false;
    JSON.stringify(syntax, function (key, value) {
        if (key === 'tokens') {
            result = true;
        }
        return value;
    });
    return result;
}

// Special handling for regular expression literal since we need to
// convert it to a string literal, otherwise it will be decoded
// as object "{}" and the regular expression would be lost.
function adjustRegexLiteral(key, value) {
    'use strict';
    if (key === 'value' && value instanceof RegExp) {
        value = value.toString();
    }
    return value;
}

if (typeof window === 'undefined') {
    var esprima = require('../esprima');
}

function NotMatchingError(expected, actual) {
    'use strict';
    Error.call(this, 'Expected ');
    this.expected = expected;
    this.actual = actual;
}
NotMatchingError.prototype = new Error();

function testParse(code, syntax) {
    'use strict';
    var expected, tree, actual, options, StringObject;

    // alias, so that JSLint does not complain.
    StringObject = String;

    options = {
        comment: false,
        range: false,
        tokens: false
    };

    options.comment = hasComment(syntax);
    options.range = hasRange(syntax) && !options.comment;
    options.tokens = hasTokens(syntax);

    expected = JSON.stringify(syntax, null, 4);
    try {
        tree = esprima.parse(code, options);
        tree = (options.comment || options.tokens) ? tree : tree.body[0];
        actual = JSON.stringify(tree, adjustRegexLiteral, 4);

        // Only to ensure that there is no error when using string object.
        esprima.parse(new StringObject(code), options);

    } catch (e) {
        throw new NotMatchingError(expected, e.toString());
    }
    if (expected !== actual) {
        throw new NotMatchingError(expected, actual);
    }
}

function testError(code, exception) {
    'use strict';
    var expected, msg, actual;

    expected = JSON.stringify(exception);

    try {
        esprima.parse(code);
    } catch (e) {
        msg = e.toString();

        // Opera 9.64 produces an non-standard string in toString().
        if (msg.substr(0, 6) !== 'Error:') {
            if (typeof e.message === 'string') {
                msg = 'Error: ' + e.message;
            }
        }

        actual = JSON.stringify({
            index: e.index,
            lineNumber: e.lineNumber,
            column: e.column,
            message: msg
        });

    }

    if (expected !== actual) {
        throw new NotMatchingError(expected, actual);
    }
}

function testModify(code, result) {
    'use strict';
    var actual, expected, i, modifier, modifiers;

    function findModifier(name) {
        var properties = name.split('.'),
            object = esprima,
            i;
        for (i = 0; i < properties.length; i += 1) {
            object = object[properties[i]];
        }
        return object;
    }

    esprima.Tracer.FunctionEntrance('EnterFunction');
    modifiers = [];
    for (i = 0; i < result.modifiers.length; i += 1) {
        modifier = result.modifiers[i];
        modifiers.push(findModifier(modifier.name).call(null, modifier.config));
    }

    expected = result.result;
    try {
        actual = esprima.modify(code, modifiers);
    } catch (e) {
        throw new NotMatchingError(expected, e.toString());
    }
    if (expected !== actual) {
        throw new NotMatchingError(expected, actual);
    }
}

function runTest(code, result) {
    'use strict';
    if (typeof result === 'string' || result.hasOwnProperty('lineNumber')) {
        testError(code, result);
    } else {
        if (result.hasOwnProperty('modifiers')) {
            testModify(code, result);
        } else {
            testParse(code, result);
        }
    }
}

if (typeof window !== 'undefined') {
    // Run all tests in a browser environment.
    runTests = function () {
        'use strict';
        var total = 0,
            failures = 0,
            category,
            fixture,
            source,
            tick,
            expected;

        function setText(el, str) {
            if (typeof el.innerText === 'string') {
                el.innerText = str;
            } else {
                el.textContent = str;
            }
        }

        function startCategory(category) {
            var report, e;
            report = document.getElementById('report');
            e = document.createElement('h4');
            setText(e, category);
            report.appendChild(e);
        }

        function reportSuccess(code) {
            var report, e;
            report = document.getElementById('report');
            e = document.createElement('pre');
            e.setAttribute('class', 'code');
            setText(e, code);
            report.appendChild(e);
        }

        function reportFailure(code, expected, actual) {
            var report, e;

            report = document.getElementById('report');

            e = document.createElement('p');
            setText(e, 'Code:');
            report.appendChild(e);

            e = document.createElement('pre');
            e.setAttribute('class', 'code');
            setText(e, code);
            report.appendChild(e);

            e = document.createElement('p');
            setText(e, 'Expected');
            report.appendChild(e);

            e = document.createElement('pre');
            e.setAttribute('class', 'expected');
            setText(e, expected);
            report.appendChild(e);

            e = document.createElement('p');
            setText(e, 'Actual');
            report.appendChild(e);

            e = document.createElement('pre');
            e.setAttribute('class', 'actual');
            setText(e, actual);
            report.appendChild(e);
        }

        setText(document.getElementById('version'), esprima.version);

        tick = new Date();
        for (category in data) {
            if (data.hasOwnProperty(category)) {
                startCategory(category);
                fixture = data[category];
                for (source in fixture) {
                    if (fixture.hasOwnProperty(source)) {
                        expected = fixture[source];
                        total += 1;
                        try {
                            runTest(source, expected);
                            reportSuccess(source, JSON.stringify(expected, null, 4));
                        } catch (e) {
                            failures += 1;
                            reportFailure(source, e.expected, e.actual);
                        }
                    }
                }
            }
        }
        tick = (new Date()) - tick;

        if (failures > 0) {
            setText(document.getElementById('status'), total + ' tests. ' +
                'Failures: ' + failures + '. ' + tick + ' ms');
        } else {
            setText(document.getElementById('status'), total + ' tests. ' +
                'No failure. ' + tick + ' ms');
        }
    };
} else {
    (function () {
        'use strict';

        var total = 0,
            failures = [],
            tick = new Date(),
            expected,
            header;

        Object.keys(data).forEach(function (category) {
            Object.keys(data[category]).forEach(function (source) {
                total += 1;
                expected = data[category][source];
                try {
                    runTest(source, expected);
                } catch (e) {
                    e.source = source;
                    failures.push(e);
                }
            });
        });
        tick = (new Date()) - tick;

        header = total + ' tests. ' + failures.length + ' failures. ' +
            tick + ' ms';
        if (failures.length) {
            console.error(header);
            failures.forEach(function (failure) {
                console.error(failure.source + ': Expected\n    ' +
                    failure.expected.split('\n').join('\n    ') +
                    '\nto match\n    ' + failure.actual);
            });
        }
        console.log(header);
        process.exit(failures.length === 0 ? 0 : 1);
    }());
}
/* vim: set sw=4 ts=4 et tw=80 : */
