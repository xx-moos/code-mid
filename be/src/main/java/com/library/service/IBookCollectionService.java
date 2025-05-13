package com.library.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.library.entity.BookCollection;

/**
 * 图书收藏服务接口
 */
public interface IBookCollectionService extends IService<BookCollection> {

    /**
     * 添加收藏
     *
     * @param bookId 图书ID
     * @return 是否成功
     */
    boolean addCollection(Long bookId);

    /**
     * 取消收藏
     *
     * @param bookId 图书ID
     * @return 是否成功
     */
    boolean removeCollection(Long bookId);

    /**
     * 分页查询当前用户的收藏列表
     *
     * @param page 分页参数
     * @return 收藏列表
     */
    Page<BookCollection> listMyCollections(Page<BookCollection> page);

    /**
     * 检查当前用户是否已收藏某图书
     *
     * @param bookId 图书ID
     * @return true 如果已收藏，false 如果未收藏
     */
    boolean isBookCollected(Long bookId);

    /**
     * 根据用户ID和图书ID获取收藏记录
     * (主要供服务内部使用，例如检查重复收藏)
     *
     * @param userId 用户ID
     * @param bookId 图书ID
     * @return 收藏记录，如果不存在则返回null
     */
    BookCollection getByUserIdAndBookId(Long userId, Long bookId);
} 