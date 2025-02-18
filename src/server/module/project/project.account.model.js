//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate } from "../../utils/mongoose/plugins";

const {  ObjectId } = mongoose.Schema.Types;

const ProjectAccountSchema = new mongoose.Schema(
    {
        account: {
            type: ObjectId,
            required: true,
            index: true,
        },
        project: {
            type: ObjectId,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

ProjectAccountSchema.index({ createdAt: 1 });
ProjectAccountSchema.index({ updatedAt: 1 });
ProjectAccountSchema.index({ account: 1, project: 1 }, { unique: true })

// add plugin that converts mongoose to json
ProjectAccountSchema.plugin(toJSON);
ProjectAccountSchema.plugin(paginate);

export default mongoose.models.ProjectAccount ||
    mongoose.model("ProjectAccount", ProjectAccountSchema);
