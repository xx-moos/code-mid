package com.library.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.library.common.exception.CustomException;
import com.library.dto.BookCommentAddDTO;
import com.library.dto.BookCommentPageQueryDTO;
import com.library.dto.BookCommentUpdateDTO;
import com.library.entity.BookComment;
import com.library.entity.User;
import com.library.mapper.BookCommentMapper;
import com.library.service.IBookCommentService;
import com.library.service.UserService;
import com.library.vo.BookCommentVO;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class BookCommentServiceImpl extends ServiceImpl<BookCommentMapper, BookComment> implements IBookCommentService {

  @Resource
  private UserService userService;

  private User getCurrentUserOrThrow() {
    User currentUser = userService.getCurrentUser();
    if (currentUser == null) {
      throw new CustomException("");
    }
    return currentUser;
  }

  @Override
  @Transactional
  public void addComment(BookCommentAddDTO addDTO) {
    User currentUser = getCurrentUserOrThrow();

    // 校验 parentId 是否有效 (如果提供了)
    if (addDTO.getParentId() != null) {
      BookComment parentComment = getById(addDTO.getParentId());
      if (parentComment == null) {
        throw new CustomException("回复的父评论不存在");
      }
      // 通常回复的评论应该属于同一本书
      if (!parentComment.getBookId().equals(addDTO.getBookId())) {
        throw new CustomException("回复的父评论与当前图书不符");
      }
    }

    BookComment bookComment = new BookComment();
    BeanUtils.copyProperties(addDTO, bookComment);
    bookComment.setUserId(currentUser.getId());
    bookComment.setLikes(0); // 初始化点赞数为0
    save(bookComment);
  }

  @Override
  @Transactional
  public void updateComment(BookCommentUpdateDTO updateDTO) {
    User currentUser = getCurrentUserOrThrow();
    BookComment existingComment = getById(updateDTO.getId());

    if (existingComment == null) {
      throw new CustomException("评论不存在");
    }

    // 只有评论者本人或管理员可以修改
    if (!existingComment.getUserId().equals(currentUser.getId())) {
      throw new CustomException("您无权修改此评论");
    }

    existingComment.setContent(updateDTO.getContent());
    updateById(existingComment);
  }

  @Override
  @Transactional
  public void deleteComment(Long commentId) {
    User currentUser = getCurrentUserOrThrow();
    BookComment comment = getById(commentId);
    if (comment == null) {
      throw new CustomException("评论不存在或已被删除");
    }

    // 只有评论者本人或管理员可以删除
    if (!comment.getUserId().equals(currentUser.getId())) {
      // 同时需要考虑是否有子评论，以及如何处理子评论（例如，标记为"原评论已删除"或级联删除）
      // 此处简单处理，只允许本人或管理员删除
      throw new CustomException("您无权删除此评论");
    }

    // 检查是否有子评论，如果有，则不直接删除或进行特殊处理
    long childrenCount = this.count(new LambdaQueryWrapper<BookComment>().eq(BookComment::getParentId, commentId));
    if (childrenCount > 0) {
      // 方案1: 逻辑删除父评论，内容修改为"评论已删除"，子评论保留
      // comment.setContent("该评论已删除");
      // comment.setDeleted(1); // 假设BaseEntity有此字段且MP自动处理
      // updateById(comment);
      // 方案2: 不允许删除有子评论的评论
      throw new CustomException("该评论下有回复，无法直接删除");
      // 方案3: 级联逻辑删除 (需要递归)
    }

    // 逻辑删除
    removeById(commentId);
  }

  @Override
  public Page<BookCommentVO> getBookCommentsPage(BookCommentPageQueryDTO queryDTO) {
    Page<BookComment> page = new Page<>(queryDTO.getCurrent(), queryDTO.getSize());
    LambdaQueryWrapper<BookComment> queryWrapper = new LambdaQueryWrapper<>();

    if (queryDTO.getStatus() != null) {
      queryWrapper.eq(BookComment::getStatus, queryDTO.getStatus());
    }

    if (queryDTO.getBookId() != null) {
      queryWrapper.eq(BookComment::getBookId, queryDTO.getBookId());
    }

    if (queryDTO.getParentId() != null) {
      queryWrapper.eq(BookComment::getParentId, queryDTO.getParentId());
    } else {
      queryWrapper.isNull(BookComment::getParentId); // 查询顶级评论
    }

    // 排序
    if (StringUtils.isNotBlank(queryDTO.getSortBy())) {
      // 简单的排序处理，例如: "create_time_desc" 或 "likes_asc"
      String[] sortParams = queryDTO.getSortBy().split("_");
      if (sortParams.length == 2) {
        boolean isAsc = "asc".equalsIgnoreCase(sortParams[1]);
        if ("create_time".equalsIgnoreCase(sortParams[0])) {
          queryWrapper.orderBy(true, isAsc, BookComment::getCreateTime);
        } else if ("likes".equalsIgnoreCase(sortParams[0])) {
          queryWrapper.orderBy(true, isAsc, BookComment::getLikes);
        }
      }
    } else {
      queryWrapper.orderByDesc(BookComment::getCreateTime); // 默认按创建时间降序
    }

    page(page, queryWrapper);

    Page<BookCommentVO> voPage = new Page<>();
    BeanUtils.copyProperties(page, voPage, "records");

    if (page.getRecords().isEmpty()) {
      voPage.setRecords(Collections.emptyList());
      return voPage;
    }

    List<Long> userIds = page.getRecords().stream().map(BookComment::getUserId).distinct().collect(Collectors.toList());
    Map<Long, User> userMap = userService.listUsersByIds(userIds).stream()
        .collect(Collectors.toMap(User::getId, u -> u));

    List<BookCommentVO> voList = page.getRecords().stream().map(comment -> {
      BookCommentVO vo = new BookCommentVO();
      BeanUtils.copyProperties(comment, vo);
      User user = userMap.get(comment.getUserId());
      if (user != null) {
        vo.setUsername(user.getUsername());
        vo.setUserAvatar(user.getAvatar());
      }
      // 初步获取直接子评论 (如果需要显示多级，则需要更复杂的递归或多次查询组装)
      vo.setChildren(getChildrenComments(comment.getId(), userMap));
      return vo;
    }).collect(Collectors.toList());

    voPage.setRecords(voList);
    return voPage;
  }

  // 辅助方法获取子评论 (递归获取，或只获取一层)
  private List<BookCommentVO> getChildrenComments(Long parentId, Map<Long, User> userMap) {
    LambdaQueryWrapper<BookComment> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(BookComment::getParentId, parentId);
    queryWrapper.orderByAsc(BookComment::getCreateTime); // 子评论按时间升序
    List<BookComment> children = list(queryWrapper);

    if (children.isEmpty()) {
      return Collections.emptyList();
    }

    return children.stream().map(comment -> {
      BookCommentVO vo = new BookCommentVO();
      BeanUtils.copyProperties(comment, vo);
      User user = userMap.get(comment.getUserId()); // 复用已查询的用户信息
      if (user == null) { // 如果子评论的用户不在初始用户列表，需要重新获取
        User childUser = userService.getById(comment.getUserId());
        if (childUser != null) {
          vo.setUsername(childUser.getUsername());
          vo.setUserAvatar(childUser.getAvatar());
        }
      } else {
        vo.setUsername(user.getUsername());
        vo.setUserAvatar(user.getAvatar());
      }
      // 递归获取孙子评论 (为避免无限递归和性能问题，这里只获取一层，或者限制深度)
      // vo.setChildren(getChildrenComments(comment.getId(), userMap));
      return vo;
    }).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public void likeComment(Long commentId) {
    BookComment comment = getById(commentId);
    if (comment == null) {
      throw new CustomException("评论不存在");
    }
    // 此处简化，直接增加点赞数。实际项目中可能需要记录点赞用户，防止重复点赞。
    comment.setLikes(comment.getLikes() + 1);
    updateById(comment);
  }

  @Override
  @Transactional
  public void unlikeComment(Long commentId) {
    BookComment comment = getById(commentId);
    if (comment == null) {
      throw new CustomException("评论不存在");
    }
    if (comment.getLikes() > 0) {
      comment.setLikes(comment.getLikes() - 1);
      updateById(comment);
    }
  }

  @Override
  @Transactional
  public void auditComment(Long commentId, Integer status) {
    BookComment comment = getById(commentId);
    if (comment == null) {
      throw new CustomException("评论不存在");
    }
    comment.setStatus(status);
    updateById(comment);
  }

}