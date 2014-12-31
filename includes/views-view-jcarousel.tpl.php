<?php

/**
 * @file views-view-jcarousel.tpl.php
 * View template to display a list as a carousel.
 */
?>

 <div class="jcarousel-wrapper <?php print $jcarousel_classes; ?>">
  <div <?php print $data_attributes; ?> class="jcarousel">
    <ul>
      <?php foreach ($rows as $id => $row): ?>
        <li class="<?php print $row_classes[$id]; ?>"><?php print $row; ?></li>
      <?php endforeach; ?>
    </ul>
  </div>
  <a class="jcarousel-prev" href="#">Prev</a>
  <a class="jcarousel-next" href="#">Next</a>
</div>
