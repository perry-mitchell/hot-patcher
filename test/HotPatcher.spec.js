const HotPatcher = require("../source/index.js");

describe("HotPatcher", function() {
    it("instantiates without error", function() {
        expect(() => {
            new HotPatcher();
        }).to.not.throw();
    });

    describe("instance", function() {
        beforeEach(function() {
            this.patcher = new HotPatcher();
        });

        describe("control", function() {
            beforeEach(function() {
                this.patcher2 = new HotPatcher();
            });

            it("sets configuration of target to configuration of controller", function() {
                this.patcher.control(this.patcher2);
                expect(this.patcher.configuration).to.equal(this.patcher2.configuration);
            });

            it("throws if the type is not recognised", function() {
                expect(() => {
                    this.patcher.control({});
                }).to.throw(/Invalid type/);
            });

            it("copies keys and overwrites target duplicates", function() {
                const testMethod = () => {};
                const testMethod2 = () => {};
                const testMethod3 = () => {};
                this.patcher.patch("test", testMethod);
                this.patcher2.patch("test3", testMethod3);
                this.patcher2.patch("test", testMethod2);
                this.patcher.control(this.patcher2);
                expect(this.patcher.get("test")).to.equal(testMethod);
                expect(this.patcher2.get("test")).to.equal(testMethod);
                expect(this.patcher2.get("test3")).to.equal(testMethod3);
            });

            it("copies keys and overwrites own duplicates when configured", function() {
                const testMethod = () => {};
                const testMethod2 = () => {};
                const testMethod3 = () => {};
                this.patcher.patch("test", testMethod);
                this.patcher2.patch("test3", testMethod3);
                this.patcher2.patch("test", testMethod2);
                this.patcher.control(this.patcher2, /* allow overrides: */ true);
                expect(this.patcher.get("test")).to.equal(testMethod2);
                expect(this.patcher2.get("test")).to.equal(testMethod2);
                expect(this.patcher2.get("test3")).to.equal(testMethod3);
            });
        });

        describe("execute", function() {
            beforeEach(function() {
                this.spyFn = sinon.spy();
                this.patcher.patch("test", this.spyFn);
            });

            it("executes the function provided", function() {
                this.patcher.execute("test");
                expect(this.spyFn.calledOnce).to.be.true;
            });

            it("executes the function with specified parameters", function() {
                this.patcher.execute("test", 1, 2, 3);
                expect(this.spyFn.calledWithExactly(1, 2, 3)).to.be.true;
            });

            it("executes the function with correctly bound 'this'", function() {
                const testThis = {};
                this.patcher.patch("test", this.spyFn, testThis);
                this.patcher.execute("test", 1, 2, 3);
                expect(this.spyFn.calledOn(testThis)).to.be.true;
            });

            it("executes a NOOP if the item doesn't exist", function() {
                expect(() => {
                    this.patcher.execute("noexist", 123);
                }).to.not.throw();
            });
        });

        describe("get", function() {
            beforeEach(function() {
                this.testMethod = () => 5;
                this.patcher.patch("test", this.testMethod);
            });

            it("returns the correct method", function() {
                expect(this.patcher.get("test")).to.equal(this.testMethod);
            });

            it("returns null by default if item doesn't exist", function() {
                expect(this.patcher.get("noexist")).to.be.null;
            });

            it("throws, when configured, if item doesn't exist", function() {
                this.patcher.getEmptyAction = "throw";
                expect(() => {
                    this.patcher.get("noexist");
                }).to.throw(/No method provided.+noexist/);
            });

            it("throws, when configured incorrectly, if item doesn't exist", function() {
                this.patcher.getEmptyAction = "invalid!!!";
                expect(() => {
                    this.patcher.get("noexist");
                }).to.throw(/Invalid empty-action specified/);
            });
        });

        describe("isPatched", function() {
            beforeEach(function() {
                this.patcher.patch("test", () => {});
            });

            it("recognises patched keys", function() {
                expect(this.patcher.isPatched("test")).to.be.true;
            });

            it("recognises non-patched keys", function() {
                expect(this.patcher.isPatched("test2")).to.be.false;
            });
        });

        describe("patch", function() {
            it("patches methods", function() {
                const method = () => 10;
                this.patcher.patch("test", method);
                expect(this.patcher.get("test")).to.equal(method);
            });

            it("returns 'this'", function() {
                const out = this.patcher.patch("test", () => {});
                expect(out).to.equal(this.patcher);
            });

            it("throws when method is not a function", function() {
                expect(() => {
                    this.patcher.patch("test", 2);
                }).to.throw(/'test'.+not a function/);
            });

            it("throws when the item has been marked as being final", function() {
                this.patcher.patch("test", () => {}).setFinal("test");
                expect(() => {
                    this.patcher.patch("test", () => {});
                }).to.throw(/'test'.+marked as being final/);
            });
        });

        describe("patchInline", function() {
            it("runs in-line functions", function() {
                const spy = sinon.stub().returnsArg(1);
                const test = (a, b) => this.patcher.patchInline("test", spy, a, b);
                test(1, 2);
                expect(spy.calledOnce).to.be.true;
                expect(spy.calledWithExactly(1, 2)).to.be.true;
            });

            it("returns value from method", function() {
                const spy = sinon.stub().returnsArg(1);
                const test = (a, b) => this.patcher.patchInline("test", spy, a, b);
                expect(test(1, 2)).to.equal(2);
            });

            it("allows for patching before execution", function() {
                const spy1 = sinon.stub().returnsArg(1);
                const spy2 = sinon.stub().returnsArg(0);
                const test = (a, b) => this.patcher.patchInline("test", spy1, a, b);
                this.patcher.patch("test", spy2);
                expect(test(1, 2)).to.equal(1);
                expect(spy1.notCalled).to.be.true;
                expect(spy2.calledOnce).to.be.true;
            });
        });

        describe("setFinal", function() {
            it("marks the item as being final", function() {
                this.patcher.patch("test", () => {});
                expect(this.patcher.configuration.registry.test.final).to.be.false;
                this.patcher.setFinal("test");
                expect(this.patcher.configuration.registry.test.final).to.be.true;
            });

            it("throws when no method is found for key", function() {
                expect(() => {
                    this.patcher.setFinal("noexist");
                }).to.throw(/'noexist'.+No method found for key/);
            });
        });
    });
});
