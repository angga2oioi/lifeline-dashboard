//@ts-check

import projectModel from "./project.model"

export const findProjectbyId = async (id) => {

    let raw = await projectModel.findById(id)

    return raw?.toJSON()

}