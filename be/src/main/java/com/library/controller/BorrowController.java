package com.library.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.library.common.Result;
import com.library.dto.BorrowDTO;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.service.BorrowService;
import com.library.service.UserService;
import com.library.vo.BorrowRecordVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import javax.annotation.Resource;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 借阅控制器
 */
@Slf4j
@Api(tags = "借阅管理")
@RestController
@RequestMapping("/borrow")
public class BorrowController {

    @Resource
    private BorrowService borrowService;

    @Resource
    private UserService userService;

    @ApiOperation("借书")
    @PostMapping
    // @PreAuthorize("isAuthenticated()")
    public Result<BorrowRecord> borrow(@Valid @RequestBody BorrowDTO borrowDTO) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return Result.unauthorized();
        }
        BorrowRecord record = borrowService.borrow(currentUser.getId(), borrowDTO);
        return Result.success(record);
    }

    @ApiOperation("还书")
    @GetMapping("/return/{recordId}")
    // @PreAuthorize("isAuthenticated()")
    public Result<Void> returnBook(@PathVariable Long recordId, @RequestParam Integer rating) {
        boolean result = borrowService.returnBook(recordId, rating);
        return result ? Result.success() : Result.failed("还书失败");
    }

    @ApiOperation("续借")
    @PostMapping("/renew/{recordId}")
    // @PreAuthorize("isAuthenticated()")
    public Result<Void> renew(@PathVariable Long recordId) {
        boolean result = borrowService.renew(recordId);
        return result ? Result.success() : Result.failed("续借失败");
    }

    @ApiOperation("查询我的借阅记录")
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public Result<Page<BorrowRecordVO>> myBorrows(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页条数") @RequestParam(defaultValue = "10") Integer size,
            @ApiParam("借阅状态") @RequestParam(required = false) Integer status
    ) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return Result.unauthorized();
        }
        Page<BorrowRecordVO> page = borrowService.userBorrows(new Page<>(current, size), currentUser.getId(), status);
        return Result.success(page);
    }

    @ApiOperation("分页查询所有借阅记录 (管理员)")
    @GetMapping("/page")
    // @PreAuthorize("hasRole('ADMIN')")
    public Result<Page<BorrowRecordVO>> pageBorrows(
            @ApiParam("页码") @RequestParam(defaultValue = "1") Integer current,
            @ApiParam("每页条数") @RequestParam(defaultValue = "10") Integer size,
            @ApiParam("用户名") @RequestParam(required = false) String username,
            @ApiParam("图书名称") @RequestParam(required = false) String bookName,
            @ApiParam("借阅状态") @RequestParam(required = false) Integer status
    ) {
        Page<BorrowRecordVO> page = borrowService.pageBorrows(new Page<>(current, size), username, bookName, status);
        return Result.success(page);
    }

    @ApiOperation("查询借阅记录详情")
    @GetMapping("/{recordId}")
    // @PreAuthorize("isAuthenticated()")
    public Result<BorrowRecordVO> getBorrowDetail(@PathVariable Long recordId) {
        BorrowRecordVO detail = borrowService.getBorrowDetail(recordId);
        return detail != null ? Result.success(detail) : Result.failed("借阅记录不存在");
    }


    @ApiOperation("审核借阅申请")
    @PutMapping("/audit/{id}")
    public Result<Void> audit(@PathVariable Long id) {
        boolean result = borrowService.audit(id);
        return result ? Result.success() : Result.failed("审核借阅申请失败");
    }
} 