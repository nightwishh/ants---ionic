import * as profile_component from "./profile.component"
// @ponicode
describe("inst.fillProfile", () => {
    let inst: any

    beforeEach(() => {
        inst = new profile_component.ProfileComponent()
    })

    test("0", () => {
        inst.fillProfile(undefined)
    })

    test("1", () => {
        let result: any = inst.fillProfile({ DATA: { fullName: "ponicode.com", phone: "+44 7911 123456'", email: "user@host:300" } })
        expect(result).toBe(null)
    })
})
