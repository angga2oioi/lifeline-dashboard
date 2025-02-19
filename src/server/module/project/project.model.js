//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate,aggregatePaginate } from "../../utils/mongoose/plugins";

const { String, Mixed } = mongoose.Schema.Types;

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        credential: {
            type: Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

ProjectSchema.index({ createdAt: 1 });
ProjectSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
ProjectSchema.plugin(toJSON);
ProjectSchema.plugin(paginate);
ProjectSchema.plugin(aggregatePaginate);

export default mongoose.models.Project ||
    mongoose.model("Project", ProjectSchema);
