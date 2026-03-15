import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
export interface FeedQueryDto {
    category?: string;
    city?: string;
    page?: number;
    limit?: number;
    authorId?: string;
}
export declare class FeedService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPosts(query: FeedQueryDto): Promise<{
        data: {
            commentCount: number;
            _count: undefined;
            id: string;
            createdAt: Date;
            title: string | null;
            body: string;
            category: string;
            city: string | null;
            eventDate: Date | null;
            budgetPaise: number | null;
            authorId: string;
            authorRole: string;
            mediaUrls: import("@prisma/client/runtime/library").JsonValue;
            likesCount: number;
            author: {
                id: string;
                name: string | null;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createPost(authorId: string, authorRole: string, dto: CreatePostDto): Promise<{
        id: string;
        createdAt: Date;
        title: string | null;
        body: string;
        category: string;
        city: string | null;
        eventDate: Date | null;
        budgetPaise: number | null;
        status: string;
    }>;
    deletePost(id: string, userId: string): Promise<{
        message: string;
    }>;
    getComments(postId: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        authorId: string;
        author: {
            id: string;
            name: string | null;
        };
    }[]>;
    createComment(postId: string, authorId: string, dto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        author: {
            id: string;
            name: string | null;
        };
    }>;
    deleteComment(id: string, userId: string): Promise<{
        message: string;
    }>;
    toggleHidePost(id: string): Promise<{
        id: string;
        status: string;
    }>;
    adminDeletePost(id: string): Promise<{
        message: string;
    }>;
}
