import { ObjectId } from "mongodb";

const IHaveADreamAnalysis = {
    _id: new ObjectId('67acf4ce0cb163ff508c58e7'),
    textDocumentId: new ObjectId('6759beb8ce0eaf62c5a51c28'),
    paragraphAnalyses: [{
        paragraphId: new ObjectId('676ed11a671e130398d258c6'),
        highlights: [{
            _id: new ObjectId(),
            start: 0,
            end: 6
        }, {
            _id: new ObjectId(),
            start: 40,
            end: 50
        }]
    }]
};

export default IHaveADreamAnalysis;