export interface IUser extends Document{
    name:string;
    peerId:string;
    role:"host" | "participant";
}