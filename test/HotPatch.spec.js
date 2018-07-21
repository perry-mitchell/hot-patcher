const HotPatch = require("../source/index.js");

describe("HotPatch", function() {
    it("instantiates without error", function() {
        expect(() => {
            new HotPatch();
        }).to.not.throw();
    });

    describe("instance", function() {
        beforeEach(function() {
            this.patcher = new HotPatch();
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
                this.patcher
                    .patch("test", () => {})
                    .setFinal("test");
                expect(() => {
                    this.patcher.patch("test", () => {});
                }).to.throw(/'test'.+marked as being final/);
            });
        });

        describe("setFinal", function() {
            it("marks the item as being final", function() {
                this.patcher.patch("test", () => {});
                expect(this.patcher._registry.test.final).to.be.false;
                this.patcher.setFinal("test");
                expect(this.patcher._registry.test.final).to.be.true;
            });

            it("throws when no method is found for key", function() {
                expect(() => {
                    this.patcher.setFinal("noexist")
                }).to.throw(/'noexist'.+No method found for key/);
            });
        });
    });
});
