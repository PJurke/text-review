import { ObjectId } from "mongodb";

export default interface UserEntity {
    _id: ObjectId;
    email: string;
    password: string;
}