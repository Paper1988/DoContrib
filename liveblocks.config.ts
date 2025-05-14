declare module "liveblocks" {
    interface Liveblocks {
        UserMeta: {
            id: string;

            info: {
            name: string;
            color: string;
            avatar: string;

            // Your custom metadata
            // ...
            };
        };
    }
}