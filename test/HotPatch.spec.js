const HotPatch = require("../source/index.js");

describe("HotPatch", function() {
    it("instantiates without error", function() {
        expect(() => {
            new HotPatch();
        }).to.not.throw();
    });
});
