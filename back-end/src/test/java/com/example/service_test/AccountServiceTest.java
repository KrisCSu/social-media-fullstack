package com.example.service_test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.entity.Account;
import com.example.repository.AccountRepository;
import com.example.service.AccountService;

public class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private AccountService accountService;

    private Account account;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        account = new Account();
        account.setAccountId(1);
        account.setUsername("testuser");
        account.setPassword("testpassword");
        account.setBio("Test Bio");

        // Mock repository behavior
        when(accountRepository.findByUsername("testuser")).thenReturn(Optional.of(account));
        when(accountRepository.findById(1)).thenReturn(Optional.of(account));
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    public void testRegisterAccount() {
        Account newAccount = new Account();
        newAccount.setUsername("newuser");
        newAccount.setPassword("newpassword");

        // Mock that the username does not already exist
        when(accountRepository.findByUsername("newuser")).thenReturn(Optional.empty());

        // Call the method under test
        Account registeredAccount = accountService.register(newAccount);

        // Verify results
        assertNotNull(registeredAccount);
        assertEquals("newuser", registeredAccount.getUsername());

        // Verify interactions
        verify(accountRepository).save(newAccount);
    }

    @Test
    public void testRegisterAccount_UsernameExists() {
        Account newAccount = new Account();
        newAccount.setUsername("testuser");
        newAccount.setPassword("newpassword");

        // Expect exception for existing username
        assertThrows(IllegalStateException.class, () -> accountService.register(newAccount));

        // Verify no interaction with save
        verify(accountRepository, never()).save(any());
    }

    @Test
    public void testLogin() {
        // Call the method under test
        Account loggedInAccount = accountService.login("testuser", "testpassword");

        // Verify results
        assertNotNull(loggedInAccount);
        assertEquals("testuser", loggedInAccount.getUsername());

        // Verify interactions
        verify(accountRepository).findByUsername("testuser");
    }

    @Test
    public void testLogin_InvalidCredentials() {
        // Expect exception for invalid password
        assertThrows(IllegalArgumentException.class, () -> accountService.login("testuser", "wrongpassword"));

        // Verify no other interactions
        verify(accountRepository).findByUsername("testuser");
    }

    @Test
    public void testGetAccountById() {
        // Call the method under test
        Optional<Account> retrievedAccount = accountService.getAccountById(1);

        // Verify results
        assertTrue(retrievedAccount.isPresent());
        assertEquals("testuser", retrievedAccount.get().getUsername());

        // Verify interactions
        verify(accountRepository).findById(1);
    }

    @Test
    public void testGetAccountById_NotFound() {
        // Mock repository behavior for non-existent ID
        when(accountRepository.findById(2)).thenReturn(Optional.empty());

        // Call the method under test
        Optional<Account> retrievedAccount = accountService.getAccountById(2);

        // Verify results
        assertFalse(retrievedAccount.isPresent());

        // Verify interactions
        verify(accountRepository).findById(2);
    }
}