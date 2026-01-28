package com.pasteBin.Pastebin.repository;

import com.pasteBin.Pastebin.entity.Paste;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasteRepository extends JpaRepository<Paste, String> {
}

