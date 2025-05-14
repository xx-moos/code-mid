package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.library.common.ResultCode;
import com.library.common.exception.CustomException;
import com.library.entity.Book;
import com.library.entity.BookCollection;
import com.library.entity.User;
import com.library.mapper.BookCollectionMapper;
import com.library.service.BookService;
import com.library.service.IBookCollectionService;
import com.library.service.UserService;
import java.util.List;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 图书收藏服务实现类
 */
@Slf4j
@Service
public class BookCollectionServiceImpl extends ServiceImpl<BookCollectionMapper, BookCollection> implements IBookCollectionService {

    @Resource
    private UserService userService;

    @Resource
    private BookService bookService;

    /**
     * 获取当前登录用户，如果未登录则抛出异常
     *
     * @return 当前用户
     */
    private User getCurrentUserOrThrow() {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            log.warn("用户未登录，无法执行收藏相关操作");
            throw new CustomException(ResultCode.UNAUTHORIZED);
        }
        return currentUser;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addCollection(Long bookId) {
        User currentUser = getCurrentUserOrThrow();
        Long userId = currentUser.getId();

        // 检查是否已收藏
        if (getByUserIdAndBookId(userId, bookId) != null) {
            log.info("用户ID:{} 已收藏过图书ID:{}, 无需重复添加", userId, bookId);
            throw new CustomException("您已收藏过该图书，无需重复添加");
        }

        BookCollection collection = new BookCollection();
        collection.setUserId(userId);
        collection.setBookId(bookId);
        // 由数据库的 DEFAULT CURRENT_TIMESTAMP 填充
        boolean saved = this.save(collection);
        if (saved) {
            log.info("用户ID:{} 成功收藏图书ID:{}, 收藏记录ID:{}", userId, bookId, collection.getId());
        }
        return saved;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean removeCollection(Long bookId) {
        User currentUser = getCurrentUserOrThrow();
        Long userId = currentUser.getId();

        LambdaQueryWrapper<BookCollection> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(BookCollection::getUserId, userId)
                .eq(BookCollection::getBookId, bookId);

        boolean removed = this.remove(queryWrapper);
        if (removed) {
            log.info("用户ID:{} 成功取消收藏图书ID:{}", userId, bookId);
        } else {
            log.warn("用户ID:{} 尝试取消收藏图书ID:{} 失败，可能之前未收藏", userId, bookId);
        }
        return removed;
    }

    @Override
    public Page<BookCollection> listMyCollections(Page<BookCollection> page) {
        User currentUser = getCurrentUserOrThrow();
        Long userId = currentUser.getId();

        LambdaQueryWrapper<BookCollection> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(BookCollection::getUserId, userId)
                .orderByDesc(BookCollection::getCreateTime);

        // 先执行分页查询获取当前页的收藏记录
        Page<BookCollection> collectionPage = this.page(page, queryWrapper);
        List<BookCollection> collections = collectionPage.getRecords();
        
        if (!collections.isEmpty()) {
            // 获取当前页所有收藏记录的图书ID
            List<Long> bookIds = collections.stream()
                    .map(BookCollection::getBookId)
                    .collect(Collectors.toList());
            
            // 批量查询这些图书的信息
            List<Book> books = bookService.listByIds(bookIds);
            
            // 将图书信息关联到收藏记录中
            for (BookCollection collection : collections) {
                Book book = books.stream()
                        .filter(b -> b.getId().equals(collection.getBookId()))
                        .findFirst()
                        .orElse(null);
                
                if (book != null) {
                    collection.setBookName(book.getName());
                }
            }
        }
          
        return collectionPage;
    }

    @Override
    public boolean isBookCollected(Long bookId) {
        User currentUser = userService.getCurrentUser(); // 这里允许未登录用户查询，不抛异常
        if (currentUser == null) {
            return false; // 未登录用户视为未收藏
        }
        return getByUserIdAndBookId(currentUser.getId(), bookId) != null;
    }

    @Override
    public BookCollection getByUserIdAndBookId(Long userId, Long bookId) {
        if (userId == null || bookId == null) {
            return null;
        }
        LambdaQueryWrapper<BookCollection> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(BookCollection::getUserId, userId)
                .eq(BookCollection::getBookId, bookId);
        return this.getOne(queryWrapper);
    }
} 