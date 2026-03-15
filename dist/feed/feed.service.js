"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FeedService = class FeedService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPosts(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 20, 50);
        const skip = (page - 1) * limit;
        const where = { status: 'ACTIVE' };
        if (query.category) {
            where.category = query.category;
        }
        if (query.city) {
            where.city = { equals: query.city, mode: 'insensitive' };
        }
        if (query.authorId) {
            where.authorId = query.authorId;
        }
        const [posts, total] = await Promise.all([
            this.prisma.feedPost.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    body: true,
                    category: true,
                    city: true,
                    eventDate: true,
                    budgetPaise: true,
                    mediaUrls: true,
                    likesCount: true,
                    createdAt: true,
                    authorId: true,
                    authorRole: true,
                    author: {
                        select: { id: true, name: true },
                    },
                    _count: {
                        select: { comments: true },
                    },
                },
            }),
            this.prisma.feedPost.count({ where }),
        ]);
        return {
            data: posts.map((p) => ({
                ...p,
                commentCount: p._count.comments,
                _count: undefined,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createPost(authorId, authorRole, dto) {
        return this.prisma.feedPost.create({
            data: {
                authorId,
                authorRole,
                title: dto.title,
                body: dto.body,
                category: dto.category ?? 'GENERAL',
                city: dto.city,
                eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
                budgetPaise: dto.budgetPaise,
            },
            select: {
                id: true,
                title: true,
                body: true,
                category: true,
                city: true,
                eventDate: true,
                budgetPaise: true,
                status: true,
                createdAt: true,
            },
        });
    }
    async deletePost(id, userId) {
        const post = await this.prisma.feedPost.findUnique({ where: { id } });
        if (!post || post.status === 'DELETED') {
            throw new common_1.NotFoundException('Feed post not found');
        }
        if (post.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own posts');
        }
        await this.prisma.feedPost.update({
            where: { id },
            data: { status: 'DELETED' },
        });
        return { message: 'Post deleted successfully' };
    }
    async getComments(postId) {
        const post = await this.prisma.feedPost.findUnique({
            where: { id: postId },
        });
        if (!post || post.status === 'DELETED') {
            throw new common_1.NotFoundException('Feed post not found');
        }
        return this.prisma.feedComment.findMany({
            where: { postId, status: 'ACTIVE' },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                body: true,
                createdAt: true,
                authorId: true,
                author: { select: { id: true, name: true } },
            },
        });
    }
    async createComment(postId, authorId, dto) {
        const post = await this.prisma.feedPost.findUnique({ where: { id: postId } });
        if (!post || post.status === 'DELETED') {
            throw new common_1.NotFoundException('Feed post not found');
        }
        return this.prisma.feedComment.create({
            data: {
                postId,
                authorId,
                body: dto.body,
            },
            select: {
                id: true,
                body: true,
                createdAt: true,
                author: { select: { id: true, name: true } },
            },
        });
    }
    async deleteComment(id, userId) {
        const comment = await this.prisma.feedComment.findUnique({ where: { id } });
        if (!comment || comment.status === 'DELETED') {
            throw new common_1.NotFoundException('Comment not found');
        }
        if (comment.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own comments');
        }
        await this.prisma.feedComment.update({
            where: { id },
            data: { status: 'DELETED' },
        });
        return { message: 'Comment deleted successfully' };
    }
    async toggleHidePost(id) {
        const post = await this.prisma.feedPost.findUnique({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('Feed post not found');
        }
        const newStatus = post.status === 'HIDDEN' ? 'ACTIVE' : 'HIDDEN';
        return this.prisma.feedPost.update({
            where: { id },
            data: { status: newStatus },
            select: { id: true, status: true },
        });
    }
    async adminDeletePost(id) {
        const post = await this.prisma.feedPost.findUnique({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException('Feed post not found');
        }
        await this.prisma.feedPost.delete({ where: { id } });
        return { message: 'Post permanently deleted' };
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedService);
//# sourceMappingURL=feed.service.js.map