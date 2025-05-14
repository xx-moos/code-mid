package com.library.controller;

import com.library.common.Result;
import com.library.entity.Book;
import com.library.service.RecommendationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations") // 统一API路径前缀
@Api(tags = "图书推荐接口")
@Slf4j
public class RecommendationController {

  private final RecommendationService recommendationService;

  @Autowired
  public RecommendationController(RecommendationService recommendationService) {
    this.recommendationService = recommendationService;
  }

  @ApiOperation("获取用户图书推荐")
  @GetMapping("/user/{userId}")
  public Result<List<Book>> getUserRecommendations(
      @ApiParam(value = "用户ID", required = true) @PathVariable Long userId,
      @ApiParam(value = "推荐数量", defaultValue = "10") @RequestParam(defaultValue = "10") int count) {

    log.info("请求用户 {} 的 {} 条图书推荐", userId, count);
    if (count <= 0 || count > 50) { // 限制推荐数量范围
      log.warn("推荐数量 {} 无效，将使用默认值 10", count);
      count = 10;
    }
    try {
      List<Book> recommendations = recommendationService.getRecommendations(userId, count);
      if (recommendations.isEmpty()) {
        log.info("未能为用户 {} 生成推荐列表。", userId);
        return Result.success(recommendations, "暂无更多推荐");
      }
      return Result.success(recommendations);
    } catch (Exception e) {
      log.error("获取用户 {} 图书推荐失败: {}", userId, e.getMessage(), e);
      return Result.failed("获取推荐失败，请稍后再试");
    }
  }
}