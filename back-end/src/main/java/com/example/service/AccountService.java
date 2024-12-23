package com.example.service;

import java.util.Optional;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.entity.Account;
import com.example.repository.AccountRepository;
import com.example.util.JwtUtil;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account register(Account account) {
        if (account.getUsername() == null || account.getUsername().isEmpty() || account.getPassword().length() < 8) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            throw new IllegalStateException("Account already exists");
        }
        if (account.getBio() == null || account.getBio().isEmpty()) {
            account.setBio("This user has not set a bio yet.");
        }
        account.setAccountId(null);
        return accountRepository.save(account);
    }

    public Account login(String username, String password) {
        return accountRepository.findByUsername(username)
                .filter(account -> {
                    return account.getPassword().equals(password);
                })
                .orElseThrow(() -> {
                    return new IllegalArgumentException("Invalid username or password");
                });
    }

    public Account updateProfile(Integer accountId, String newUsername, String newBio) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (newUsername != null && !newUsername.isEmpty()) {
            Optional<Account> existingAccount = accountRepository.findByUsername(newUsername);
            if (existingAccount.isPresent() && !existingAccount.get().getAccountId().equals(accountId)) {
                throw new IllegalStateException("Username already taken");
            }
            account.setUsername(newUsername);
        }

        if (newBio != null) {
            account.setBio(newBio);
        }

        return accountRepository.save(account);
    }

    public List<Account> searchAccountsByUsername(String query) {
        // Call the repository's case-insensitive search
        return accountRepository.searchAccountsByUsernameIgnoreCase(query);
    }

    public void updateBio(Integer accountId, String newBio) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        account.setBio(newBio);
        accountRepository.save(account);
    }

    public Optional<Account> getAccountById(Integer accountId) {
        return accountRepository.findById(accountId);
    }
}